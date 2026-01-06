
import "./env";
import { pool } from './db/index';

async function listTables() {
    if (!pool) {
        console.log("Pool is null");
        return;
    }
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        console.log("Tables found:", res.rows.map(r => r.table_name));

        // Also check if companies table has data if it exists
        if (res.rows.some(r => r.table_name === 'companies')) {
            const count = await pool.query('SELECT count(*) FROM companies');
            console.log("Companies count:", count.rows[0].count);
        }

    } catch (err: any) {
        console.log("ERROR querying DB:", err.message);
    } finally {
        process.exit(0);
    }
}

listTables();
