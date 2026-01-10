
import pkg from 'pg';
const { Pool } = pkg;

// Hardcoded known working credential for diagnostics
const dbUrl = "postgres://postgres.hdwubhvmzfggsrtgkdlv:integraiempresa01@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=disable";

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function listTables() {
    try {
        console.log("Connected to DB, listing tables...");
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

        console.log("Tables:");
        res.rows.forEach(row => {
            console.log(row.table_name);
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}

listTables();
