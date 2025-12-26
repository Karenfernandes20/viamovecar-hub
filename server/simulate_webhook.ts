
import fs from 'fs';

export const simulateWebhook = async () => {
    const payload = {
        type: "messages.upsert",
        data: {
            key: {
                remoteJid: "5511999999999@s.whatsapp.net",
                fromMe: false,
                id: "TEST_MSG_ID_" + Date.now()
            },
            pushName: "Test User",
            messageType: "conversation",
            message: {
                conversation: "Olá! Esta é uma mensagem de teste simulada."
            },
            messageTimestamp: Math.floor(Date.now() / 1000)
        }
    };

    console.log("Simulating webhook...");
    try {
        const res = await fetch("http://localhost:3000/api/evolution/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response Body (Full):", text);
        fs.writeFileSync('webhook_response.json', text);
    } catch (e) {
        console.error("Failed:", e);
    }
};

simulateWebhook();
