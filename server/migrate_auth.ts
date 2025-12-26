import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Try to load from root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const migrate = async () => {
    // Dynamic import to ensure .env is loaded first (ESM hoisting fix)
    const { pool } = await import('./db');

    try {
        console.log('--- Starting Migration ---');

        if (!pool) {
            console.error('Database connection failed (pool is null). Check DATABASE_URL.');
            return;
        }

        // Create app_users table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                role VARCHAR(50) DEFAULT 'USUARIO',
                email_validated BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                phone VARCHAR(50),
                user_type VARCHAR(50),
                city_id INTEGER,
                state VARCHAR(2),
                created_at TIMESTAMP DEFAULT NOW(),
                last_login TIMESTAMP
            );
        `);

        // Create companies table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS companies (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                cnpj VARCHAR(20),
                city VARCHAR(100),
                state VARCHAR(2),
                phone VARCHAR(20),
                logo_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        // Add columns if they don't exist (for existing tables)
        await pool.query(`
            ALTER TABLE app_users 
            ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
            ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USUARIO',
            ADD COLUMN IF NOT EXISTS email_validated BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
            ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
        `);

        console.log('Added columns to app_users.');

        // Seed SuperAdmin if not exists
        const adminEmail = 'dev.karenfernandes@gmail.com';
        const adminPass = 'Klpf1212!';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(adminPass, salt);

        const checkAdmin = await pool.query('SELECT * FROM app_users WHERE email = $1', [adminEmail]);

        if (checkAdmin.rows.length === 0) {
            await pool.query(`
                INSERT INTO app_users (full_name, email, password_hash, role, email_validated, is_active, phone, user_type, city_id, state)
                VALUES ($1, $2, $3, 'SUPERADMIN', true, true, '000000000', 'admin', 1, 'SP')
            `, ['Super Admin', adminEmail, hash]);
            console.log(`SuperAdmin created: ${adminEmail}`);
        } else {
            // Update existing user to have SUPERADMIN role and password if missing or changed
            await pool.query(`
                UPDATE app_users 
                SET role = 'SUPERADMIN', 
                    password_hash = $1,
                    email_validated = true
                WHERE email = $2
            `, [hash, adminEmail]);
            console.log('SuperAdmin updated/promoted.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        const { pool } = await import('./db');
        if (pool) await pool.end();
    }
};

migrate();
