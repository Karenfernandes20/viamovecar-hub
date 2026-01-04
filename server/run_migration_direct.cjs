
require('dotenv').config({ path: '../.env' });

const { Pool } = require('pg');
const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error("DATABASE_URL not found in env");
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("Migrating: Adding message_origin column...");
        await pool.query("ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS message_origin VARCHAR(50)");
        console.log("Migration Success");
        process.exit(0);
    } catch (e) {
        console.error("Migration Failed:", e);
        process.exit(1);
    }
}
run();
