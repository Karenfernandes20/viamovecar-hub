
import { pool } from './index';

export const runMigrations = async () => {
    if (!pool) return;
    try {
        console.log("Running migrations...");

        // 1. Create financial_transactions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS financial_transactions (
                id SERIAL PRIMARY KEY,
                description TEXT NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('payable', 'receivable')),
                amount DECIMAL(12, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                due_date TIMESTAMP,
                paid_at TIMESTAMP,
                city_id INTEGER,
                category VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // 2. Add category column if missing
        try {
            await pool.query(`ALTER TABLE financial_transactions ADD COLUMN category VARCHAR(100);`);
        } catch (e: any) {
            // Ignore duplicate_column error
        }

        // 3. Add paid_at column if missing
        try {
            await pool.query(`ALTER TABLE financial_transactions ADD COLUMN paid_at TIMESTAMP;`);
        } catch (e: any) {
            // Ignore duplicate_column error
        }

        console.log("Migrations finished.");
    } catch (e) {
        console.error("Migration Error:", e);
    }
};
