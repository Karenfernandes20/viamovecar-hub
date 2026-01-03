
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const res = await pool.query('SELECT id, name, evolution_instance FROM companies');
        console.log('COMPANIES:', JSON.stringify(res.rows, null, 2));

        const res2 = await pool.query('SELECT instance, company_id, COUNT(*) as count FROM whatsapp_conversations GROUP BY instance, company_id');
        console.log('INSTANCES:', JSON.stringify(res2.rows, null, 2));

        const res3 = await pool.query('SELECT m.sent_at, m.content, c.instance, c.company_id FROM whatsapp_messages m JOIN whatsapp_conversations c ON m.conversation_id = c.id ORDER BY m.sent_at DESC LIMIT 5');
        console.log('LAST_MESSAGES:', JSON.stringify(res3.rows, null, 2));

    } catch (e: any) {
        console.error('ERROR:', e.message);
    } finally {
        await pool.end();
    }
}

run();
