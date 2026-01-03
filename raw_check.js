
import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: "postgresql://cadastro_cliente_iwbo_user:FfL8UvH9Mh658L4fX6VbC8jC9U1xS4s7@dpg-csid9h3tq21c738un2tg-a.oregon-postgres.render.com/cadastro_cliente_iwbo",
    ssl: { rejectUnauthorized: false }
});

async function run() {
    await client.connect();
    const res = await client.query('SELECT id, name, evolution_instance FROM companies');
    console.log('COMPANIES:');
    console.table(res.rows);

    const res2 = await client.query("SELECT instance, count(*) FROM whatsapp_conversations GROUP BY instance");
    console.log('CONVERSATIONS:');
    console.table(res2.rows);

    await client.end();
}

run().catch(console.error);
