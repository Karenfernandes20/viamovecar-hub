const pkg = require('pg');
const { Pool } = pkg;
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function findIntegrai() {
    try {
        const res = await pool.query("SELECT id, name, evolution_instance FROM companies");
        console.table(res.rows);
        process.exit(0);
    } catch (err) {
        console.error('DATABASE ERROR MESSAGE:', err.message);
        console.error('FULL ERROR:', err);
        process.exit(1);
    }
}

findIntegrai();
