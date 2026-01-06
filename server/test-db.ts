
import "./env";
import { pool } from './db/index';

async function testConnection() {
    if (!pool) {
        console.log("Pool is null");
        return;
    }
    try {
        const res = await pool.query('SELECT NOW() as now');
        console.log("SUCCESS");
    } catch (err: any) {
        console.log("ERROR_MESSAGE:" + err.message);
        console.log("ERROR_CODE:" + err.code);
    } finally {
        process.exit(0);
    }
}

testConnection();
