
import './env';
import { pool } from './db';

async function debugFailures() {
    if (!pool) { console.log('No pool'); process.exit(1); }
    try {
        console.log('--- Debugging Campaign Failures ---');

        // 1. Get recent failed campaigns
        const campaigns = await pool.query(`
            SELECT id, name, status, failed_count, sent_count 
            FROM whatsapp_campaigns 
            ORDER BY created_at DESC LIMIT 5
        `);

        for (const c of campaigns.rows) {
            console.log(`\nCampaign: ${c.name} (ID: ${c.id})`);
            console.log(`Status: ${c.status} | Failed: ${c.failed_count} | Sent: ${c.sent_count}`);

            // 2. Get contacts status distribution
            const dist = await pool.query(`
                SELECT status, count(*) 
                FROM whatsapp_campaign_contacts 
                WHERE campaign_id = $1 
                GROUP BY status
            `, [c.id]);
            console.log('Contact Statuses:', dist.rows.map(r => `${r.status}: ${r.count}`).join(', '));

            // 3. Get actual failure records
            const fails = await pool.query(`
                SELECT phone, error_message, updated_at 
                FROM whatsapp_campaign_contacts 
                WHERE campaign_id = $1 AND status = 'failed'
            `, [c.id]);

            if (fails.rows.length === 0) {
                console.log('NO FAILURE RECORDS FOUND despite failed_count.');
            } else {
                console.log(`Found ${fails.rows.length} failure records:`);
                fails.rows.forEach(f => console.log(` - ${f.phone}: ${f.error_message}`));
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

debugFailures();
