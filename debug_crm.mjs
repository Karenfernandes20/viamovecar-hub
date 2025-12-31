
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const res = await pool.query("SELECT id, name, phone FROM crm_leads");
        console.log('COUNT LEADS:', res.rows.length);
        console.log('SAMPLES:', res.rows.slice(0, 10));

        const stages = await pool.query("SELECT id, name FROM crm_stages");
        console.log('STAGES:', JSON.stringify(stages.rows));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
