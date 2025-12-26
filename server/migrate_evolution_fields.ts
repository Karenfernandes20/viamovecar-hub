import path from 'path';
import dotenv from 'dotenv';

// Try to load from root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const migrate = async () => {
    // Dynamic import to ensure .env is loaded first
    const { pool } = await import('./db');

    try {
        console.log('--- Starting Evolution Fields Migration ---');

        if (!pool) {
            console.error('Database connection failed.');
            return;
        }

        // Add evolution fields to companies
        await pool.query(`
            ALTER TABLE companies 
            ADD COLUMN IF NOT EXISTS evolution_instance VARCHAR(255),
            ADD COLUMN IF NOT EXISTS evolution_apikey VARCHAR(255);
        `);

        console.log('Added evolution_instance and evolution_apikey columns to companies.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        const { pool } = await import('./db');
        if (pool) await pool.end();
    }
};

migrate();
