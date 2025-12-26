import path from 'path';
import dotenv from 'dotenv';

// Try to load from root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const migrate = async () => {
    // Dynamic import to ensure .env is loaded first
    const { pool } = await import('./db');

    try {
        console.log('--- Starting Company ID Migration ---');

        if (!pool) {
            console.error('Database connection failed.');
            return;
        }

        // Add company_id to app_users
        await pool.query(`
            ALTER TABLE app_users 
            ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
        `);

        console.log('Added company_id column to app_users.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        const { pool } = await import('./db');
        if (pool) await pool.end();
    }
};

migrate();
