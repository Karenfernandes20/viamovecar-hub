const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Running migration...');
        await pool.query('ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS participant TEXT');
        await pool.query('ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS sender_name TEXT');
        console.log('Success!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
