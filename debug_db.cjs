
const pkg = require('pg');
const { Pool } = pkg;
const { URL } = require('url');
const dns = require('dns');
require('dotenv').config();

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const databaseUrl = process.env.DATABASE_URL;

let poolConfig = null;

if (databaseUrl) {
    try {
        const url = new URL(databaseUrl);
        poolConfig = {
            user: url.username,
            password: url.password,
            host: url.hostname,
            port: parseInt(url.port || '5432'),
            database: url.pathname.slice(1),
            ssl: { rejectUnauthorized: false },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
            family: 4
        };
    } catch (e) {
        poolConfig = {
            connectionString: databaseUrl,
            ssl: { rejectUnauthorized: false },
            family: 4
        };
    }
}

const pool = new Pool(poolConfig);

async function run() {
    try {
        const res = await pool.query('SELECT id, name, evolution_instance FROM companies');
        console.log('COMPANIES_DATA:', JSON.stringify(res.rows));
    } catch (e) {
        console.error('DB_ERROR:', e.message);
    } finally {
        await pool.end();
    }
}

run();
