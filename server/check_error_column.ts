import './env';
import { pool } from './db';

async function checkColumnType() {
    try {
        const res = await pool!.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'whatsapp_campaign_contacts' AND column_name = 'error_message'
        `);
        console.log("Column Info:", res.rows[0]);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

checkColumnType();
