
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('--- COMPANIES ---');
        const res = await pool.query('SELECT id, name, evolution_instance FROM companies');
        console.table(res.rows);

        console.log('\n--- INSTANCES IN CONVERSATIONS ---');
        const res2 = await pool.query('SELECT instance, company_id, COUNT(*) FROM whatsapp_conversations GROUP BY instance, company_id');
        console.table(res2.rows);

        console.log('\n--- LAST 5 MESSAGES ---');
        const res3 = await pool.query('SELECT m.sent_at, m.content, c.instance, c.company_id FROM whatsapp_messages m JOIN whatsapp_conversations c ON m.conversation_id = c.id ORDER BY m.sent_at DESC LIMIT 5');
        console.table(res3.rows);

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

run();
