
import pg from 'pg';
const { Client } = pg;

const projectRef = 'faugdfdukdshcofhdmgy';
const password = 'Klpf1212@@@!';
const region = 'sa-east-1';

async function test() {
    // 1. Try Pooler (Recommended for Render)
    const poolerHost = `aws-0-${region}.pooler.supabase.com`;
    const poolerUser = `postgres.${projectRef}`;
    const poolerUrl = `postgresql://${poolerUser}:${encodeURIComponent(password)}@${poolerHost}:6543/postgres?sslmode=no-verify`;

    console.log(`Testing Pooler Connection...`);
    try {
        const client = new Client({ connectionString: poolerUrl, connectionTimeoutMillis: 5000 });
        await client.connect();
        console.log(`✅ SUCCESS (Pooler)!`);
        console.log(`URL: ${poolerUrl}`);
        await client.end();
        return;
    } catch (e) {
        console.log(`❌ Pooler Failed: ${e.message}`);
    }

    // 2. Try Direct
    const directHost = `db.${projectRef}.supabase.co`;
    const directUrl = `postgresql://postgres:${encodeURIComponent(password)}@${directHost}:5432/postgres?sslmode=no-verify`;

    console.log(`Testing Direct Connection...`);
    try {
        const client = new Client({ connectionString: directUrl, connectionTimeoutMillis: 5000 });
        await client.connect();
        console.log(`✅ SUCCESS (Direct)!`);
        console.log(`URL: ${directUrl}`);
        await client.end();
    } catch (e) {
        console.log(`❌ Direct Failed: ${e.message}`);
    }
}

test();
