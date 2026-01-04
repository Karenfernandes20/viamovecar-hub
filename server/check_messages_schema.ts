import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function check() {
    try {
        const dbModule = await import('./db/index.ts');
        const pool = dbModule.pool;

        if (!pool) {
            console.error("Pool is null");
            process.exit(1);
        }

        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'whatsapp_messages'
        `);
        console.log("Columns:", res.rows.map(r => r.column_name).join(', '));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
