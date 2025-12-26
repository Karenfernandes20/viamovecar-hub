import pkg from 'pg';
const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.warn("DATABASE_URL não definida. Configure-a no Render para conectar ao Postgres/PgHero.");
}

export const pool = databaseUrl
    ? new Pool({
        connectionString: databaseUrl,
        ssl: {
            rejectUnauthorized: false, // Required for many cloud providers if they use self-signed certs
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // Increased timeout
    })
    : null;

if (pool) {
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        // Do not exit process, just log
    });
}
