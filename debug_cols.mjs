
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("--- crm_leads ---");
        const cols1 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'crm_leads'");
        cols1.rows.forEach(r => console.log(r.column_name));

        console.log("--- whatsapp_contacts ---");
        const cols2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'whatsapp_contacts'");
        cols2.rows.forEach(r => console.log(r.column_name));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
