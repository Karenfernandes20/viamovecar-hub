
import dotenv from 'dotenv';
dotenv.config();
import { pool } from './db';

async function check() {
    try {
        const res = await pool.query("SELECT id, name, operation_type FROM companies");
        console.log("------- COMPANIES DATA -------");
        console.table(res.rows);
        console.log("------------------------------");
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

check();
