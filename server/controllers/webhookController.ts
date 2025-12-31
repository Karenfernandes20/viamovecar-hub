import { Request, Response } from 'express';
import { pool } from '../db';

// Tipo simplificado da mensagem
interface WebhookMessage {
    key: {
        remoteJid: string;
        fromMe: boolean;
        id: string;
    };
    pushName?: string;
    messageType: string;
    message: any;
    messageTimestamp: number;
}

// Caching for performance
const instanceCache = new Map<string, number>();
const stagesCache: { map: any, lastFetch: number } = { map: null, lastFetch: 0 };
const STAGE_CACHE_TTL = 300000; // 5 minutes

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        let type = body.type || body.event;
        let data = body.data;
        let instance = body.instance || (data?.instance) || 'integrai';

        if (Array.isArray(body) && body.length > 0) {
            type = body[0].type || body[0].event;
            data = body[0].data;
            instance = body[0].instance || 'integrai';
        }

        if (!type) return res.status(200).send();

        const normalizedType = type.toLowerCase();
        if (normalizedType !== 'messages.upsert' && normalizedType !== 'messages_upsert') {
            return res.status(200).send();
        }

        let msg: any = Array.isArray(data?.messages) ? data.messages[0] : (data?.messages || data);
        if (!msg || !msg.key) return res.status(200).send();

        const remoteJid = msg.key.remoteJid;
        if (remoteJid === 'status@broadcast') return res.status(200).send();

        // 0. Resolve Company ID (Cached)
        if (!pool) return res.status(500).send();

        let companyId: number | null = instanceCache.get(instance) || null;
        if (!companyId) {
            const compLookup = await pool.query('SELECT id FROM companies WHERE evolution_instance = $1', [instance]);
            if (compLookup.rows.length > 0) {
                companyId = compLookup.rows[0].id;
                instanceCache.set(instance, companyId!);
            }
        }

        if (!companyId) return res.status(200).send(); // Ignore if unmapped

        // 1. Prepare Data
        const isFromMe = msg.key.fromMe;
        const direction = isFromMe ? 'outbound' : 'inbound';
        const phone = remoteJid.split('@')[0];
        const name = msg.pushName || phone;
        const isGroup = remoteJid.includes('@g.us');
        let groupName = null;
        if (isGroup) groupName = `Grupo ${phone.substring(0, 6)}...`;

        // 2. UPSERT Conversation (Optimized)
        let conversationId: number;
        let currentStatus: string = 'PENDING';

        // This query is critical, keep it explicit
        const checkConv = await pool.query(
            `SELECT id, status, is_group, contact_name, company_id FROM whatsapp_conversations WHERE external_id = $1 AND instance = $2 AND company_id = $3`,
            [remoteJid, instance, companyId]
        );

        if (checkConv.rows.length > 0) {
            const row = checkConv.rows[0];
            conversationId = row.id;
            const existingStatus = row.status || 'PENDING';
            currentStatus = existingStatus;

            // Status Transitions
            // We can optimize this by only firing update if status ACTUALLY changes
            let newStatus = existingStatus;
            if (direction === 'inbound' && existingStatus === 'CLOSED') newStatus = 'PENDING';
            else if (direction === 'outbound' && existingStatus !== 'OPEN') newStatus = 'OPEN';

            const promises = [];

            if (newStatus !== existingStatus) {
                currentStatus = newStatus;
                promises.push(pool.query("UPDATE whatsapp_conversations SET status = $1 WHERE id = $2", [newStatus, conversationId]));
            }

            if (msg.pushName && !row.is_group && row.contact_name !== msg.pushName) {
                promises.push(pool.query('UPDATE whatsapp_conversations SET contact_name = $1 WHERE id = $2', [msg.pushName, conversationId]));
            }

            // Fire non-critical updates but don't await them for processing flow unless critical
            Promise.all(promises).catch(err => console.error("Bg update error", err));

        } else {
            currentStatus = direction === 'outbound' ? 'OPEN' : 'PENDING';
            const newConv = await pool.query(
                `INSERT INTO whatsapp_conversations (external_id, phone, contact_name, instance, status, company_id, is_group, group_name) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [remoteJid, phone, isGroup && groupName ? groupName : name, instance, currentStatus, companyId, isGroup, groupName]
            );
            conversationId = newConv.rows[0].id;
        }

        // 3. Insert Message
        let content = '';
        let messageType = 'text';
        let mediaUrl: string | null = null;
        const m = msg.message;
        const participant = msg.key.participant || null;

        // Type inference (keeping logic same, just simplified read)
        if (m?.conversation) { content = m.conversation; }
        else if (m?.extendedTextMessage?.text) { content = m.extendedTextMessage.text; }
        else if (m?.imageMessage) { messageType = 'image'; content = m.imageMessage.caption || ''; mediaUrl = m.imageMessage.url || null; }
        else if (m?.videoMessage) { messageType = 'video'; content = m.videoMessage.caption || ''; mediaUrl = m.videoMessage.url || null; }
        else if (m?.audioMessage) { messageType = 'audio'; mediaUrl = m.audioMessage.url || null; }
        else if (m?.documentMessage) { messageType = 'document'; content = m.documentMessage.fileName || m.documentMessage.caption || ''; mediaUrl = m.documentMessage.url || null; }
        else if (m?.stickerMessage) { messageType = 'sticker'; mediaUrl = m.stickerMessage.url || null; }
        else if (m?.locationMessage) { messageType = 'location'; content = `${m.locationMessage.degreesLatitude}, ${m.locationMessage.degreesLongitude}`; }
        else if (m?.contactMessage) { messageType = 'contact'; content = m.contactMessage.displayName || 'Contato'; }
        else { content = JSON.stringify(m).substring(0, 100); messageType = 'unknown'; }

        const sent_at = new Date((msg.messageTimestamp || Date.now() / 1000) * 1000);

        const insertedMsg = await pool.query(
            `INSERT INTO whatsapp_messages (conversation_id, direction, content, sent_at, status, external_id, message_type, media_url, participant, sender_name) 
             VALUES ($1, $2, $3, $4, 'received', $5, $6, $7, $8, $9) 
             ON CONFLICT DO NOTHING RETURNING *`,
            [conversationId, direction, content, sent_at, msg.key.id, messageType, mediaUrl, participant, msg.pushName]
        );

        // If duplicate, stop here
        if (insertedMsg.rows.length === 0) return res.status(200).send();

        // 4. Update Conversation Metadata (Background)
        // We do not await this to slow down the socket emit, BUT we need to ensure it runs.
        // Actually, for consistency, let's keep it in flow but parallelize with socket prep.

        const updateMetaPromise = pool.query(
            `UPDATE whatsapp_conversations 
             SET last_message_at = $1, last_message = $2, 
                 unread_count = CASE WHEN $3 = 'inbound' THEN unread_count + 1 ELSE unread_count END 
             WHERE id = $4`,
            [sent_at, content, direction, conversationId]
        );

        // 5. Emit Socket Event (IMMEDIATELY)
        const io = req.app.get('io');
        if (io) {
            const room = `company_${companyId}`;

            // Calculate safe contact name for socket
            // Use existing row data if available to be faster, or fallback to parsed name
            let safeContactName = name;
            if (isGroup) {
                if (checkConv.rows.length > 0) safeContactName = checkConv.rows[0].contact_name;
                else safeContactName = groupName || name;
            } else {
                if (checkConv.rows.length > 0 && checkConv.rows[0].contact_name && checkConv.rows[0].contact_name !== phone) {
                    safeContactName = checkConv.rows[0].contact_name;
                }
            }

            io.to(room).emit('message:received', {
                ...insertedMsg.rows[0],
                phone,
                contact_name: safeContactName,
                remoteJid,
                instance,
                company_id: companyId,
                status: currentStatus
            });
            // console.log(`[Webhook] Emitted socket for ${phone}`);
        }

        // 6. CRM Logic (Background / Deferred)
        // We can let the request finish (res.send) and have this run, or await it.
        // To be safe against process termination, we usually await, but we can do it after the response is sent?
        // Express doesn't strictly kill promises after res.send, but it's risky in serverless. 
        // We will "Process Parallel" with the updateMetaPromise.

        const crmLogicPromise = (async () => {
            if (direction === 'inbound') {
                // Determine Stages (Cached)
                const now = Date.now();
                if (!stagesCache.map || (now - stagesCache.lastFetch > STAGE_CACHE_TTL)) {
                    const sRes = await pool!.query("SELECT id, name FROM crm_stages");
                    stagesCache.map = sRes.rows.reduce((acc: any, s: any) => {
                        acc[s.name.toUpperCase()] = s.id;
                        return acc;
                    }, {});
                    stagesCache.lastFetch = now;
                }
                const stagesMap = stagesCache.map;

                const leadsStageId = stagesMap['LEADS'] || stagesMap['PENDENTES'];

                // Parallel Checks: Contact Reg check AND Lead Check
                const [contactCheck, checkLead] = await Promise.all([
                    pool!.query(`SELECT id FROM whatsapp_contacts WHERE phone = $1 AND (company_id = $2 OR instance = $3) AND name IS NOT NULL AND name != '' AND name != $1 LIMIT 1`, [phone, companyId, instance]),
                    pool!.query('SELECT id, stage_id FROM crm_leads WHERE phone = $1 AND (company_id = $2 OR company_id IS NULL)', [phone, companyId])
                ]);

                const isRegistered = contactCheck.rows.length > 0;

                if (checkLead.rows.length === 0) {
                    if (!isRegistered && leadsStageId) {
                        console.log(`[CRM Auto] New Lead: ${phone}`);
                        await pool!.query(
                            `INSERT INTO crm_leads (name, phone, origin, stage_id, company_id, created_at, updated_at, description) 
                             VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), 'Criado automaticamente - Novo Contato')`,
                            [name, phone, 'WhatsApp', leadsStageId, companyId]
                        );
                    }
                } else {
                    const leadId = checkLead.rows[0].id;
                    await pool!.query('UPDATE crm_leads SET updated_at = NOW(), company_id = COALESCE(company_id, $1) WHERE id = $2', [companyId, leadId]);
                }
            }
        })();

        await Promise.all([updateMetaPromise, crmLogicPromise]); // Wait for DB consistency before ensuring done, but faster than serial.

        return res.status(200).json({ status: 'success' });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(200).json({ status: 'error' });
    }
};

export const getConversations = async (req: Request, res: Response) => {
    try {
        if (!pool) return res.status(500).json({ error: 'Database not configured' });

        // Determine instance from authenticated user
        // Logic: SuperAdmin sees 'integrai' (default) or needs a way to select?
        // Admin/User sees their company's instance.
        const user = (req as any).user;
        let companyId = user?.company_id;

        // If user is SuperAdmin but company_id is null/0, they might be viewing 'integrai' by default
        // or we need to allow them to view any company. 
        // For now, if SuperAdmin, they see all if no company_id, OR if they have a company_id, they see that.

        let query = `
            SELECT c.*, 
            (SELECT content FROM whatsapp_messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message,
            COALESCE(co.profile_pic_url, c.profile_pic_url) as profile_pic_url
            FROM whatsapp_conversations c
            LEFT JOIN whatsapp_contacts co ON (c.external_id = co.jid AND c.instance = co.instance)
            WHERE 1=1
        `;
        const params: any[] = [];

        if (user.role !== 'SUPERADMIN') {
            query += ` AND c.company_id = $1`;
            params.push(companyId);
        } else {
            // SUPERADMIN:
            // The user requested to see ONLY their instance ("integrai"). 
            // This means we must filter by their company_id as well.
            // If we ever want a "Global View" feature, we should pass a specific query param or flag.
            // For now, we enforce isolation to prevent data mixing.

            if (companyId) {
                query += ` AND c.company_id = $1`;
                params.push(companyId);
            } else {
                // If SuperAdmin has NO company_id (rare, but possible), we might choose to show all or nothing.
                // Given the strict request, let's filter for NULL company_id or block.
                // For safety, let's default to SHOWING ONLY UNASSIGNED (if any) rather than EVERYTHING.
                query += ` AND c.company_id IS NULL`;
            }
        }

        query += ` ORDER BY c.last_message_at DESC NULLS LAST`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        if (!pool) return res.status(500).json({ error: 'Database not configured' });

        const { conversationId } = req.params;
        const user = (req as any).user;
        const companyId = user?.company_id;

        // Verify that the conversation belongs to the user's company
        const check = await pool.query('SELECT company_id FROM whatsapp_conversations WHERE id = $1', [conversationId]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Conversation not found' });

        // Enforce strict check for EVERYONE, including SuperAdmin, unless they are explicitly in "Audit Mode" (not implemented yet).
        // This fixes the issue of SuperAdmin seeing "karen" messages.
        const msgCompanyId = check.rows[0].company_id;

        // Logic:
        // 1. If user has a company_id, they can ONLY see messages of that company_id.
        // 2. If message has NO company_id (orphan before migration), maybe allow? (We decided to block/hide orphans usually).
        // 3. If User is SuperAdmin AND has company_id, they are restricted to that company.

        const userHasCompany = !!companyId;
        const msgHasCompany = !!msgCompanyId;

        if (userHasCompany) {
            if (msgCompanyId !== companyId) {
                return res.status(403).json({ error: 'Você não tem permissão para acessar estas mensagens.' });
            }
        } else {
            // User has NO company (Global SuperAdmin?)
            // If they are SuperAdmin, maybe they can see everything?
            // BUT the user specifically asked to NOT see "karen" messages if they are "integrai".
            // Since "Integrai" user implies company_id=1, they fall into the 'userHasCompany' block above.
            // If we are here, it's a truly unassigned user.
            if (user.role !== 'SUPERADMIN') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }
        }

        const result = await pool.query(
            'SELECT * FROM whatsapp_messages WHERE conversation_id = $1 ORDER BY sent_at ASC',
            [conversationId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
