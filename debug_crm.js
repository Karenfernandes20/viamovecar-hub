
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const res = await pool.query("SELECT id, name, phone FROM crm_leads WHERE name ILIKE '%Karen%'");
        console.log('CRM LEADS:', res.rows);

        const stages = await pool.query("SELECT id, name FROM crm_stages");
        console.log('CRM STAGES:', stages.rows);

        const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'crm_leads'");
        console.log('CRM LEADS COLUMNS:', columns.rows.map(r => r.column_name));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
