
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        console.log("Checking for columns...");
        // Check if columns exist
        const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'whatsapp_messages' AND column_name IN ('participant', 'sender_name');
    `);

        const existing = res.rows.map(r => r.column_name);
        console.log("Existing columns:", existing);

        if (!existing.includes('participant')) {
            console.log("Adding column 'participant'...");
            await pool.query("ALTER TABLE whatsapp_messages ADD COLUMN participant TEXT;");
        } else {
            console.log("Column 'participant' already exists.");
        }

        if (!existing.includes('sender_name')) {
            console.log("Adding column 'sender_name'...");
            await pool.query("ALTER TABLE whatsapp_messages ADD COLUMN sender_name TEXT;");
        } else {
            console.log("Column 'sender_name' already exists.");
        }

        console.log("Migration complete.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}

migrate();
