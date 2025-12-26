
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// import { pool } from './server/db'; // Dynamic

const setup = async () => {
    const { pool } = await import('./server/db/index');
    if (!pool) return;

    try {
        console.log("Checking financial_transactions table...");

        // 1. Create table if not exists
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
        console.log("Table financial_transactions ensured.");

        // 2. Add category column if missing (for existing tables)
        try {
            await pool.query(`ALTER TABLE financial_transactions ADD COLUMN category VARCHAR(100);`);
            console.log("Added category column.");
        } catch (e: any) {
            // Ignore error if column exists
            if (e.code !== '42701') { // 42701 = duplicate_column
                // console.log("Column category likely exists or error:", e.message);
            }
        }

        // 3. Ensure paid_at column if missing
        try {
            await pool.query(`ALTER TABLE financial_transactions ADD COLUMN paid_at TIMESTAMP;`);
            console.log("Added paid_at column.");
        } catch (e: any) {
            if (e.code !== '42701') {
                // Ignore
            }
        }

        // 4. Seed some data if empty
        const count = await pool.query('SELECT COUNT(*) FROM financial_transactions');
        if (parseInt(count.rows[0].count) < 5) {
            console.log("Seeding dummy financial data...");
            const cities = await pool.query('SELECT id FROM cities LIMIT 5');
            const cityIds = cities.rows.map(r => r.id);
            if (cityIds.length === 0) {
                // Create a dummy city if none
                const c = await pool.query("INSERT INTO cities (name, state) VALUES ('São Paulo', 'SP') RETURNING id");
                cityIds.push(c.rows[0].id);
            }

            const services = ['Transporte', 'Manutenção', 'Combustível', 'Vendas', 'Serviços Administrativos'];
            const types = ['payable', 'receivable'];

            for (let i = 0; i < 20; i++) {
                const type = Math.random() > 0.4 ? 'receivable' : 'payable'; // More receivables for profit
                const amount = (Math.random() * 1000 + 100).toFixed(2);
                const cityId = cityIds[Math.floor(Math.random() * cityIds.length)];
                const service = services[Math.floor(Math.random() * services.length)];
                // Random date in last 3 months
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 90));

                await pool.query(`
                    INSERT INTO financial_transactions 
                    (description, type, amount, status, due_date, paid_at, city_id, category, created_at)
                    VALUES ($1, $2, $3, 'paid', $4, $4, $5, $6, $4)
                `, [`Transação ${i}`, type, amount, date, cityId, service]);
            }
            console.log("Seeded 20 transactions.");
        }

    } catch (e) {
        console.error("Setup Error:", e);
    } finally {
        await pool.end();
    }
};

setup();
