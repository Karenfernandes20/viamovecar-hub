const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkMessages() {
    try {
        const res = await pool.query(`
            SELECT id, conversation_id, direction, content, user_id, message_origin, sent_at 
            FROM whatsapp_messages 
            WHERE direction = 'outbound' 
            ORDER BY sent_at DESC 
            LIMIT 10
        `);
        console.log('--- RECENT OUTBOUND MESSAGES ---');
        console.table(res.rows);

        const res2 = await pool.query(`
            SELECT id, conversation_id, direction, content, user_id, message_origin, sent_at 
            FROM whatsapp_messages 
            WHERE user_id IS NULL AND direction = 'inbound'
            ORDER BY sent_at DESC 
            LIMIT 5
        `);
        console.log('--- RECENT INBOUND MESSAGES (CHECKING FOR MISCLASSIFIED AI) ---');
        console.table(res2.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkMessages();
