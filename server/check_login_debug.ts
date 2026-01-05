
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('Database URL:', process.env.DATABASE_URL ? 'Loaded' : 'MISSING');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Disable SSL locally if needed, or keep it flexible
    ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : undefined
});

const checkLogin = async () => {
    console.log('--- DIAGNOSTIC START ---');
    console.log('Checking credentials for: dev.karenfernandes@gmail.com');

    // 1. Check DB Connection
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
    } catch (e: any) {
        console.error('❌ Database connection failed:', e.message);
        process.exit(1);
    }

    // 2. Check Hardcoded Logic
    const email = 'dev.karenfernandes@gmail.com';
    const password = 'Klpf1212!'; // Simulate known password

    // Exact string match check from authController.ts
    const isFirstAdmin = email === 'dev.karenfernandes@gmail.com' && password === 'Klpf1212!';
    console.log(`Hardcoded check (isFirstAdmin): ${isFirstAdmin ? '✅ MATCH' : '❌ FAIL'}`);

    if (isFirstAdmin) {
        console.log('Credentials match hardcoded rules. Attempting DB lookup/creation...');
        try {
            // 3. User Lookup
            const userRes = await pool.query('SELECT id, full_name, email, role, password_hash FROM app_users WHERE LOWER(email) = LOWER($1)', [email]);

            if (userRes.rows.length === 0) {
                console.log('⚠️ User NOT FOUND in database. The login code SHOULD create it automatically.');

                // Simulate creation query
                console.log('Simulation: INSERT INTO app_users ...');
            } else {
                console.log('✅ User FOUND in database:');
                console.table(userRes.rows[0]);

                const user = userRes.rows[0];
                console.log(`User ID: ${user.id}`);
                console.log(`Role: ${user.role}`);
            }

        } catch (e: any) {
            console.error('❌ DB Query failed:', e.message);
        }
    }

    console.log('--- DIAGNOSTIC END ---');
    pool.end();
};

checkLogin();
