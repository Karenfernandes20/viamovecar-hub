
import pg from 'pg';
const { Client } = pg;

const passwords = [
    'Klpf1212!', 'Klpf1212!!!', 'Klpf1212!!!@',
    'Klpf1212', 'klpf1212', 'Klpf1212@',
    'Integrai2024', 'Integrai2025', 'Karenfernandes20',
    'postgres', '12345678'
];
const projectRef = 'faugdfdukdshcofhdmgy';
const region = 'sa-east-1'; // Sao Paulo (usual for BR users)

async function test() {
    console.log("Starting connection tests...");

    // Test 1: Pooler with Correct User Format
    const poolerHost = `aws-0-${region}.pooler.supabase.com`;
    const poolerUser = `postgres.${projectRef}`;

    for (const pass of passwords) {
        const url = `postgresql://${poolerUser}:${encodeURIComponent(pass)}@${poolerHost}:6543/postgres?sslmode=no-verify`;
        console.log(`Testing Pooler: ${url.replace(pass, '***')}`);

        try {
            const client = new Client({
                connectionString: url,
                connectionTimeoutMillis: 5000,
                ssl: { rejectUnauthorized: false }
            });
            await client.connect();
            console.log(`✅ SUCCESS (Pooler)! Password is: ${pass}`);
            console.log(`URL: ${url}`);
            await client.end();
            return;
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }

    // Test 2: Direct Connection
    const directHost = `db.${projectRef}.supabase.co`;

    for (const pass of passwords) {
        const url = `postgresql://postgres:${encodeURIComponent(pass)}@${directHost}:5432/postgres?sslmode=no-verify`;
        console.log(`Testing Direct: ${url.replace(pass, '***')}`);

        try {
            const client = new Client({
                connectionString: url,
                connectionTimeoutMillis: 5000,
                ssl: { rejectUnauthorized: false }
            });
            await client.connect();
            console.log(`✅ SUCCESS (Direct)! Password is: ${pass}`);
            console.log(`URL: ${url}`);
            await client.end();
            return;
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }
}

test();
