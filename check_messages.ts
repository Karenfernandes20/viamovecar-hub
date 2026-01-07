import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkMessages() {
    try {
        console.log('Searching for misclassified AI messages (user_id NULL, inbound)...');
        const res = await pool.query(`
            SELECT id, direction, content, user_id, message_origin, external_id
            FROM whatsapp_messages 
            WHERE user_id IS NULL AND direction = 'inbound'
            ORDER BY sent_at DESC 
            LIMIT 20
        `);

        console.table(res.rows);

        process.exit(0);
    } catch (err: any) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkMessages();
