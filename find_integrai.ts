import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        console.log('Connecting...');
        const res = await pool.query("SELECT id, name, evolution_instance FROM companies");
        console.table(res.rows);
        process.exit(0);
    } catch (err: any) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

main();
