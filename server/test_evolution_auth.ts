import dotenv from 'dotenv';
import path from 'path';

// Force load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const testAuth = async () => {
    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
    const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
    const INSTANCE = "integrai";

    console.log("Testing Evolution API Auth...");
    console.log(`URL: ${EVOLUTION_API_URL}`);
    console.log(`Key: ${EVOLUTION_API_KEY.substring(0, 5)}...`);

    if (!EVOLUTION_API_URL) {
        console.error("EVOLUTION_API_URL is missing in .env");
        return;
    }

    // 1. Try to fetch instances (Global Key check)
    try {
        console.log("\n1. Fetching instances...");
        const url = `${EVOLUTION_API_URL.replace(/\/$/, "")}/instance/fetchInstances`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text.substring(0, 200)}...`);
    } catch (e) {
        console.error("Fetch instances failed:", e);
    }

    // 2. Try to connect to 'integrai' instance
    try {
        console.log(`\n2. Connecting to instance '${INSTANCE}'...`);
        const url = `${EVOLUTION_API_URL.replace(/\/$/, "")}/instance/connect/${INSTANCE}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text.substring(0, 200)}...`);
    } catch (e) {
        console.error("Connect failed:", e);
    }
};

testAuth();
