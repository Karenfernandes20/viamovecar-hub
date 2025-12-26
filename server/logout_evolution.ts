import dotenv from 'dotenv';
dotenv.config();

const logout = async () => {
    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
    const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY; // The OLD key currently in .env
    const instance = "integrai";

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        console.error("Missing env vars");
        return;
    }

    try {
        console.log(`Logging out instance: ${instance}...`);
        const url = `${EVOLUTION_API_URL.replace(/\/$/, "")}/instance/logout/${instance}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'apikey': EVOLUTION_API_KEY
            }
        });

        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text}`);

    } catch (e) {
        console.error(e);
    }
};

logout();
