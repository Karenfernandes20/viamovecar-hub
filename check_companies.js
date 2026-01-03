
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: "postgresql://cadastro_cliente_iwbo_user:FfL8UvH9Mh658L4fX6VbC8jC9U1xS4s7@dpg-csid9h3tq21c738un2tg-a.oregon-postgres.render.com/cadastro_cliente_iwbo",
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("Checking companies...");
        const res = await pool.query('SELECT id, name, evolution_instance FROM companies');
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("Checking instances in conversations...");
        const res2 = await pool.query('SELECT instance, count(*) FROM whatsapp_conversations GROUP BY instance');
        console.log(JSON.stringify(res2.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

run();
