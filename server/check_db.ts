import { pool } from './db';

const checkDatabase = async () => {
    try {
        console.log('--- Checking Database ---');

        // Check connection
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected:', res.rows[0]);

        // Check Conversations
        const conversations = await pool.query('SELECT * FROM whatsapp_conversations');
        console.log(`Conversations found: ${conversations.rows.length}`);
        if (conversations.rows.length > 0) {
            console.log('Sample Conversation:', conversations.rows[0]);
        }

        // Check Messages
        const messages = await pool.query('SELECT * FROM whatsapp_messages ORDER BY sent_at DESC LIMIT 5');
        console.log(`Messages found (showing max 5): ${messages.rows.length}`);
        messages.rows.forEach(msg => {
            console.log(`- [${msg.direction}] ${msg.content} (${msg.sent_at})`);
        });

        // Check CRM Leads
        const leads = await pool.query('SELECT * FROM crm_leads LIMIT 5');
        console.log(`Leads found: ${leads.rows.length}`);

    } catch (error) {
        console.error('Database check failed:', error);
    } finally {
        await pool.end();
    }
};

checkDatabase();
