
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/viamovecar', // Adjust if needed
});

async function checkCompanies() {
    try {
        const res = await pool.query("SELECT id, name, operation_type FROM companies");
        console.log("COMPANIES DUMP:", res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

checkCompanies();
