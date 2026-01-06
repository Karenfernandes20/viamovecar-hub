
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

const passwords = ['Klpf1212@@@!'];
const projects = ['faugdfdukdshcofhdmgy', 'hdwubhvmzfggsrtgkdlv'];
const regions = ['sa-east-1', 'us-west-2', 'us-east-1'];

async function updateEnv(url) {
    const envPaths = [
        path.resolve(__dirname, '.env'),
        path.resolve(__dirname, 'server/.env')
    ];

    envPaths.forEach(envPath => {
        if (fs.existsSync(envPath)) {
            let content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n');
            let found = false;
            const newLines = lines.map(line => {
                if (line.startsWith('DATABASE_URL=')) {
                    found = true;
                    return `DATABASE_URL="${url}"`;
                }
                return line;
            });
            if (!found) newLines.push(`DATABASE_URL="${url}"`);
            fs.writeFileSync(envPath, newLines.join('\n'));
            console.log(`Updated ${envPath}`);
        }
    });
}

async function test() {
    for (const projectRef of projects) {
        for (const region of regions) {
            for (const password of passwords) {
                const poolerHost = `aws-0-${region}.pooler.supabase.com`;
                const poolerUser = `postgres.${projectRef}`;
                const poolerUrl = `postgresql://${poolerUser}:${encodeURIComponent(password)}@${poolerHost}:6543/postgres?sslmode=no-verify`;

                try {
                    const client = new Client({ connectionString: poolerUrl, connectionTimeoutMillis: 3000 });
                    await client.connect();
                    console.log(`✅ SUCCESS! Project: ${projectRef} | Region: ${region}`);
                    await updateEnv(poolerUrl);
                    await client.end();
                    return;
                } catch (e) { }

                const directHost = `db.${projectRef}.supabase.co`;
                const directUrl = `postgresql://postgres:${encodeURIComponent(password)}@${directHost}:5432/postgres?sslmode=no-verify`;
                try {
                    const client = new Client({ connectionString: directUrl, connectionTimeoutMillis: 3000 });
                    await client.connect();
                    console.log(`✅ SUCCESS (Direct)! Project: ${projectRef}`);
                    await updateEnv(directUrl);
                    await client.end();
                    return;
                } catch (e) { }
            }
        }
    }
    console.log("❌ No connection could be established.");
}

test();
