// Run this script to update Evolution API credentials
// Usage: node update-evolution.js

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'your-database-url-here'
});

async function updateEvolutionAPI() {
    try {
        const result = await pool.query(`
            UPDATE companies 
            SET evolution_instance = $1, 
                evolution_apikey = $2 
            WHERE id = 1
            RETURNING *
        `, ['integrai', '5A44C72AAB33-42BD-968A-27EB8E14BE6F']);

        console.log('✅ Evolution API credentials updated!');
        console.log('Updated company:', result.rows[0]);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating credentials:', error);
        await pool.end();
        process.exit(1);
    }
}

updateEvolutionAPI();
