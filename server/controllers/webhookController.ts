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

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        // Log raw body details
        console.log('--- INCOMING WEBHOOK ---');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body Type:', typeof req.body);
        console.log('Body Content:', JSON.stringify(req.body, null, 2));
        console.log('------------------------');

        const body = req.body;

        // Normalização: Evolution pode enviar objeto unico { type: ..., data: ... }
        // ou array de objetos se estiver em lote, etc.
        // Se undefined, assumir que o proprio body pode ser o "data" se type nao existir no root

        // Find the event data
        let type = body.type;
        let data = body.data;

        // Se for array, pega o primeiro (simplificação para debug)
        if (Array.isArray(body) && body.length > 0) {
            type = body[0].type;
            data = body[0].data;
            console.log('Payload identified as ARRAY. Using first element.');
        } else if (!type && body.event) {
            // Algumas versões mandam { event: "...", ... }
            type = body.event;
            data = body;
            console.log('Payload identified as EVENT field format.');
        }

        console.log(`Processed Type: ${type}`);

        if (!type) {
            console.warn('Could not identify message type from payload.');
            return res.status(200).send();
        }

        if (type === 'messages.upsert') {
            const msg = data as WebhookMessage;
            if (!msg.key) {
                console.error('Invalid message structure: missing key', msg);
                return res.status(200).send();
            }

            const remoteJid = msg.key.remoteJid;
            console.log(`Processing message from: ${remoteJid}`);

            // Ignora mensagens de status/grupo por enquanto, foca em user
            if (remoteJid.includes('@g.us') || remoteJid === 'status@broadcast') {
                console.log('Ignoring group or status message.');
                return res.status(200).send();
            }

            if (!pool) {
                console.error("Database pool not available");
                return res.status(500).send();
            }

            // 1. Upsert Conversation
            // Verifica se já existe conversa com esse ID remoto (external_id)
            let conversationId: number;
            const checkConv = await pool.query(
                'SELECT id FROM whatsapp_conversations WHERE external_id = $1',
                [remoteJid]
            );

            if (checkConv.rows.length > 0) {
                conversationId = checkConv.rows[0].id;
                // Opcional: Atualizar nome se mudou
                if (msg.pushName) {
                    await pool.query('UPDATE whatsapp_conversations SET contact_name = $1 WHERE id = $2', [msg.pushName, conversationId]);
                }
            } else {
                const newConv = await pool.query(
                    'INSERT INTO whatsapp_conversations (external_id, phone, contact_name) VALUES ($1, $2, $3) RETURNING id',
                    [remoteJid, phone, name]
                );
                conversationId = newConv.rows[0].id;
            }

            // 2. Insert Message
            // Extrair texto (simplificado)
            let content = '';
            if (msg.message?.conversation) content = msg.message.conversation;
            else if (msg.message?.extendedTextMessage?.text) content = msg.message.extendedTextMessage.text;
            else if (msg.message?.imageMessage?.caption) content = msg.message.imageMessage.caption;
            else content = '[Mídia ou outro tipo de mensagem]';

            const direction = isFromMe ? 'outbound' : 'inbound';
            const sent_at = new Date(msg.messageTimestamp * 1000);

            await pool.query(
                'INSERT INTO whatsapp_messages (conversation_id, direction, content, sent_at) VALUES ($1, $2, $3, $4)',
                [conversationId, direction, content, sent_at]
            );

            console.log(`Message saved for conversation ${conversationId}: ${content}`);

            // 3. Integração com CRM: Criar/Atualizar Lead
            // Verifica se o lead existe pelo telefone
            const checkLead = await pool.query('SELECT id FROM crm_leads WHERE phone = $1', [phone]);
            if (checkLead.rows.length === 0) {
                // Encontrar o stage "Leads" (position 1) ou o primeiro disponível
                const stageRes = await pool.query('SELECT id FROM crm_stages ORDER BY position ASC LIMIT 1');
                if (stageRes.rows.length > 0) {
                    const stageId = stageRes.rows[0].id;
                    await pool.query(
                        'INSERT INTO crm_leads (name, phone, origin, stage_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
                        [name, phone, 'WhatsApp', stageId]
                    );
                    console.log(`Created new CRM Lead for ${name} (${phone})`);
                } else {
                    console.warn('No CRM stages found. Skipping Lead creation.');
                }
            } else {
                // Atualiza o timestamp do lead existente
                await pool.query('UPDATE crm_leads SET updated_at = NOW() WHERE phone = $1', [phone]);
            }
        }

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Webhook Error:', error);
        // Retorna 200 para evitar que o Evolution fique tentando reenviar infinitamente em caso de erro de lógica
        return res.status(200).json({ status: 'error', message: 'Webhook processing failed' });
    }
};

export const getConversations = async (req: Request, res: Response) => {
    try {
        if (!pool) return res.status(500).json({ error: 'Database not configured' });

        // Retorna conversas com a última mensagem (simples)
        const result = await pool.query(`
            SELECT c.*, 
            (SELECT content FROM whatsapp_messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message,
            (SELECT sent_at FROM whatsapp_messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message_at
            FROM whatsapp_conversations c
            ORDER BY last_message_at DESC NULLS LAST
        `);

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
