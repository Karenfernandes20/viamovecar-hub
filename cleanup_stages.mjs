
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("Cleaning up duplicate stages...");

        // Move leads from IDs 11, 12, 13 to 1, 7, 8
        await pool.query("UPDATE crm_leads SET stage_id = 1 WHERE stage_id = 11");
        await pool.query("UPDATE crm_leads SET stage_id = 7 WHERE stage_id = 12");
        await pool.query("UPDATE crm_leads SET stage_id = 8 WHERE stage_id = 13");

        // Delete duplicates
        await pool.query("DELETE FROM crm_stages WHERE id IN (11, 12, 13, 9)");

        console.log("Cleanup finished.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
