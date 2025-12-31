import { pool } from './server/db';

async function fixDb() {
    try {
        if (!pool) {
            console.error('Pool not found');
            process.exit(1);
        }
        await pool.query('ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS participant TEXT');
        await pool.query('ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS sender_name TEXT');
        console.log('Database columns added successfully');
        process.exit(0);
    } catch (e) {
        console.error('Error fixing DB:', e);
        process.exit(1);
    }
}

fixDb();
