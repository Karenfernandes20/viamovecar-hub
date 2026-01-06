
import pg from 'pg';
const { Client } = pg;

const passwords = ['Klpf1212!', 'Klpf1212!!!', 'Klpf1212!!!@'];
const projectRef = 'hdwubhvmzfggsrtgkdlv';
const hosts = [
    `db.${projectRef}.supabase.co`,
    `aws-0-sa-east-1.pooler.supabase.com`
];

async function test() {
    for (const host of hosts) {
        for (const pass of passwords) {
            const port = host.includes('pooler') ? 6543 : 5432;
            const url = `postgresql://postgres:${encodeURIComponent(pass)}@${host}:${port}/postgres?sslmode=require`;
            // Note: Supabase user is usually 'postgres' or 'postgres.projectref' for pooler

            // Adjust user for pooler
            const user = host.includes('pooler') ? `postgres.${projectRef}` : 'postgres';
            const connectionString = `postgresql://${user}:${encodeURIComponent(pass)}@${host}:${port}/postgres`;

            console.log(`Trying Host: ${host} | User: ${user} | Pass: ${pass}`);

            const client = new Client({
                connectionString,
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 3000
            });

            try {
                await client.connect();
                console.log(`SUCCESS! Connected with:
                Host: ${host}
                User: ${user}
                Pass: ${pass}
                URL: ${connectionString.replace(pass, '****')}
                `);

                // Write successful URL to .env
                // ... logic to verify tables exist
                await client.end();
                return { success: true, url: connectionString };
            } catch (err) {
                console.log(`Failed: ${err.message}`);
            }
        }
    }
    return { success: false };
}

test();
