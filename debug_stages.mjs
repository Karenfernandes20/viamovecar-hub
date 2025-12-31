
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const stages = await pool.query("SELECT id, name FROM crm_stages");
        console.log('--- STAGES ---');
        stages.rows.forEach(s => console.log(`ID: ${s.id}, Name: ${s.name}`));
        process.exit(0);
    } catch (e) {
        console.error(e);
    }
}
run();
