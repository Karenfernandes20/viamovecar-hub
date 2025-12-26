
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const run = async () => {
    const { pool } = await import('./server/db/index');
    if (!pool) return;
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log("Tables:", JSON.stringify(res.rows.map(r => r.table_name), null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
};
run();
