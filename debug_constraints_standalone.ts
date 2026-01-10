

import pkg from 'pg';
const { Pool } = pkg;
// Hardcoded known working credential for diagnostics
const dbUrl = "postgres://postgres.hdwubhvmzfggsrtgkdlv:integraiempresa01@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=disable";


const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function checkConstraints() {
    try {
        console.log("Connected to DB, querying constraints...");
        const res = await pool.query(`
            SELECT
                tc.table_name, 
                kcu.column_name, 
                tc.constraint_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.table_name = 'app_users';
        `);

        console.log("Foreign keys referencing app_users:");
        res.rows.forEach(row => {
            console.log(`Table: ${row.table_name} | Column: ${row.column_name} | Constraint: ${row.constraint_name}`);
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}

checkConstraints();
