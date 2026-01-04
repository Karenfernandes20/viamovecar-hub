
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function migrate() {
    try {
        const dbModule = await import('./db/index.ts');
        const pool = dbModule.pool;

        if (!pool) {
            console.error("Pool is null");
            process.exit(1);
        }

        console.log("Adding message_origin column...");
        await pool.query(`
            ALTER TABLE whatsapp_messages 
            ADD COLUMN IF NOT EXISTS message_origin VARCHAR(50);
        `);
        console.log("Migration successful: Added message_origin column");
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e);
        process.exit(1);
    }
}
migrate();
