import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const check = async () => {
    console.log('Connecting to DB:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected.');

        const resConvs = await client.query('SELECT * FROM whatsapp_conversations');
        console.log('Conversations:', resConvs.rowCount);
        if (resConvs.rowCount > 0) console.log(resConvs.rows);

        const resMsgs = await client.query('SELECT * FROM whatsapp_messages');
        console.log('Messages:', resMsgs.rowCount);
        if (resMsgs.rowCount > 0) console.log(resMsgs.rows.map(m => ({ id: m.id, content: m.content, sent_at: m.sent_at })));

    } catch (e) {
        console.error('DB Error:', e);
    } finally {
        await client.end();
    }
};

check();
