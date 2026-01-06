
import pg from 'pg';
const { Client } = pg;

const passwords = ['Klpf1212@@@!'];
const projects = ['faugdfdukdshcofhdmgy', 'hdwubhvmzfggsrtgkdlv'];
const regions = ['sa-east-1', 'us-west-2', 'us-east-1'];

async function test() {
    for (const projectRef of projects) {
        for (const region of regions) {
            for (const password of passwords) {
                const poolerHost = `aws-0-${region}.pooler.supabase.com`;
                const poolerUser = `postgres.${projectRef}`;
                const poolerUrl = `postgresql://${poolerUser}:${encodeURIComponent(password)}@${poolerHost}:6543/postgres?sslmode=no-verify`;

                console.log(`Testing Pooler | Project: ${projectRef} | Region: ${region}`);
                try {
                    const client = new Client({ connectionString: poolerUrl, connectionTimeoutMillis: 3000 });
                    await client.connect();
                    console.log(`✅ SUCCESS (Pooler)! Project: ${projectRef} | Region: ${region}`);
                    console.log(`URL: ${poolerUrl}`);
                    await client.end();
                    return;
                } catch (e) {
                    console.log(`❌ Pooler Failed: ${e.message}`);
                }

                // Also try direct
                const directHost = `db.${projectRef}.supabase.co`;
                const directUrl = `postgresql://postgres:${encodeURIComponent(password)}@${directHost}:5432/postgres?sslmode=no-verify`;
                console.log(`Testing Direct | Project: ${projectRef}`);
                try {
                    const client = new Client({ connectionString: directUrl, connectionTimeoutMillis: 3000 });
                    await client.connect();
                    console.log(`✅ SUCCESS (Direct)! Project: ${projectRef}`);
                    console.log(`URL: ${directUrl}`);
                    await client.end();
                    return;
                } catch (e) {
                    console.log(`❌ Direct Failed: ${e.message}`);
                }
            }
        }
    }
}

test();
