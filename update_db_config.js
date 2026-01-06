
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPaths = [
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, 'server/.env')
];

// Project: faugdfdukdshcofhdmgy
// Password assumed: Klpf1212! (if this is wrong, user needs to update it)
// Using Pooler: aws-0-sa-east-1.pooler.supabase.com:6543
// User: postgres.[project-ref]
const newDbUrl = 'postgresql://postgres.faugdfdukdshcofhdmgy:Klpf1212!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';

envPaths.forEach(envPath => {
    if (fs.existsSync(envPath)) {
        try {
            let content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n');
            const newLines = lines.map(line => {
                if (line.startsWith('DATABASE_URL=')) {
                    return `DATABASE_URL="${newDbUrl}"`;
                }
                return line;
            });

            // If DATABASE_URL wasn't found, add it
            if (!newLines.some(l => l.startsWith('DATABASE_URL='))) {
                newLines.push(`DATABASE_URL="${newDbUrl}"`);
            }

            fs.writeFileSync(envPath, newLines.join('\n'));
            console.log(`Updated ${envPath}`);
        } catch (err) {
            console.error(`Failed to update ${envPath}:`, err);
        }
    } else {
        console.log(`File not found: ${envPath}`);
    }
});
