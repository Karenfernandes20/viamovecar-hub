import { pool } from './db';
import bcrypt from 'bcryptjs';

const migrate = async () => {
    try {
        console.log('--- Starting Migration ---');

        // Add columns if they don't exist
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
        const adminEmail = 'admin@viamovecar.com';
        const adminPass = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(adminPass, salt);

        const checkAdmin = await pool.query('SELECT * FROM app_users WHERE email = $1', [adminEmail]);

        if (checkAdmin.rows.length === 0) {
            await pool.query(`
                INSERT INTO app_users (full_name, email, password_hash, role, email_validated, is_active, phone, user_type, city_id, state)
                VALUES ($1, $2, $3, 'SUPERADMIN', true, true, '000000000', 'admin', 1, 'SP')
            `, ['Super Admin', adminEmail, hash]);
            console.log(`SuperAdmin created: ${adminEmail} / ${adminPass}`);
        } else {
            // Update existing admin to have SUPERADMIN role and password if missing
            await pool.query(`
                UPDATE app_users 
                SET role = 'SUPERADMIN', 
                    password_hash = COALESCE(password_hash, $1),
                    email_validated = true
                WHERE email = $2
            `, [hash, adminEmail]);
            console.log('SuperAdmin updated.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
};

migrate();
