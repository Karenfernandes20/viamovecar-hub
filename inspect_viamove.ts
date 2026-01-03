
import './server/env.js';
import { pool } from './server/db/index.js';

async function check() {
    try {
        const res = await pool.query('SELECT id, name, evolution_instance, evolution_apikey FROM companies');
        console.log('--- COMPANIES IN DB ---');
        console.table(res.rows);

        // Check conversions for viamovecar
        const convs = await pool.query("SELECT instance, count(*) FROM whatsapp_conversations GROUP BY instance");
        console.log('--- CONVERSATIONS BY INSTANCE ---');
        console.table(convs.rows);

        const viaRaw = await pool.query("SELECT * FROM whatsapp_conversations WHERE LOWER(instance) LIKE '%viamove%' LIMIT 5");
        console.log('--- SAMPLE VIAMOVECAR CONVERSATIONS ---');
        console.table(viaRaw.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit(0);
    }
}

check();
