
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to DB. Checking columns for whatsapp_conversations...");

        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'whatsapp_conversations'
        `);

        console.log("Columns in whatsapp_conversations:");
        res.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));

        const res2 = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'whatsapp_messages'
        `);

        console.log("\nColumns in whatsapp_messages:");
        res2.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

checkSchema();
