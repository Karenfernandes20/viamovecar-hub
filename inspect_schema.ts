
import dotenv from 'dotenv';
import path from 'path';
// Load env vars before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const run = async () => {
    // Dynamic import to allow env vars to load first
    const { pool } = await import('./server/db/index');

    if (!pool) {
        console.error("Pool not created (check DATABASE_URL)");
        return;
    }

    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'financial_transactions';
        `);
        console.log("Columns:", res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
};

run();
