
import dotenv from 'dotenv';
import path from 'path';

// Fix for windows/file structure to find .env
const envPath = path.resolve(process.cwd(), '.env');
console.log("Loading .env from", envPath);
dotenv.config({ path: envPath });

import { pool } from "./server/db";

async function checkConstraints() {
    if (!pool) {
        console.error("Pool not configured (after dotenv)");
        process.exit(1);
    }

    try {
        console.log("Querying constraints...");
        const res = await pool.query(`
            SELECT
                tc.table_name, 
                kcu.column_name, 
                tc.constraint_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.table_name = 'app_users';
        `);

        console.log("Foreign keys referencing app_users:");
        res.rows.forEach(row => {
            console.log(`Table: ${row.table_name} | Column: ${row.column_name}`);
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}

checkConstraints();
