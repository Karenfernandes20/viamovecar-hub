import "./env";
import { pool } from "./db";

const run = async () => {
    if (!pool) {
        console.error("Pool failed to initialize. Check DATABASE_URL.");
        return;
    }
    try {
        console.log("Running manual migration for operation_type...");

        // 1. Add column if not exists
        await pool.query(`
            ALTER TABLE companies 
            ADD COLUMN IF NOT EXISTS operation_type VARCHAR(20) DEFAULT 'clientes';
        `);
        console.log("Column 'operation_type' ensured.");

        // 2. Add Constraint (might fail if data violates it, catch independently)
        try {
            await pool.query(`
                ALTER TABLE companies 
                ADD CONSTRAINT check_operation_type 
                CHECK (operation_type IN ('motoristas', 'clientes', 'pacientes'));
            `);
            console.log("Constraint added.");
        } catch (e: any) {
            console.log("Constraint might already exist or data violation:", e.message);
        }

        // 3. Update NULL values to default
        const res = await pool.query(`
            UPDATE companies 
            SET operation_type = 'clientes' 
            WHERE operation_type IS NULL OR operation_type = '';
        `);
        console.log(`Updated ${res.rowCount} rows with default 'clientes'.`);

        // 4. Verify columns
        const colCheck = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'companies' AND column_name = 'operation_type';
        `);
        console.log("Column check:", colCheck.rows);

    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await pool.end();
    }
};
run();
