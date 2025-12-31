import { pool } from './server/db';

async function check() {
    try {
        const conversations = await pool.query('SELECT id, external_id, contact_name, company_id FROM whatsapp_conversations LIMIT 5');
        console.log('Conversations:', conversations.rows);

        if (conversations.rows.length > 0) {
            const firstId = conversations.rows[0].id;
            const messages = await pool.query('SELECT id, conversation_id, content FROM whatsapp_messages WHERE conversation_id = $1 LIMIT 5', [firstId]);
            console.log(`Messages for conversation ${firstId}:`, messages.rows);
        }

        const totalMessages = await pool.query('SELECT COUNT(*) FROM whatsapp_messages');
        console.log('Total messages:', totalMessages.rows[0].count);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
