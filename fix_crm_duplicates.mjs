
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function fix() {
    try {
        console.log("--- Starting CRM Fix (Stages and De-duplication) ---");

        // 1. Ensure Stages exist with correct names for Company 1
        const targetStages = ["PENDENTES", "ABERTOS", "FECHADOS"];
        for (const name of targetStages) {
            const check = await pool.query("SELECT id FROM crm_stages WHERE name = $1 LIMIT 1", [name]);
            if (check.rows.length === 0) {
                console.log(`Creating stage: ${name}`);
                await pool.query("INSERT INTO crm_stages (name, color, position) VALUES ($1, '#cccccc', (SELECT COALESCE(MAX(position),0)+1 FROM crm_stages))", [name]);
            }
        }

        // 2. Normalize and De-duplicate Leads
        console.log("Cleaning up duplicate leads...");
        const leads = await pool.query("SELECT id, name, phone FROM crm_leads");

        const seenPhones = new Map();
        const toDelete = [];

        for (const lead of leads.rows) {
            if (!lead.phone) continue;
            // Normalize: remove everything that is not a digit
            const normalized = lead.phone.replace(/\D/g, '');
            if (!normalized) continue;

            if (seenPhones.has(normalized)) {
                // Duplicate found! Keep the one with larger ID (more recent/manual)
                const existing = seenPhones.get(normalized);
                if (lead.id > existing.id) {
                    toDelete.push(existing.id);
                    seenPhones.set(normalized, lead);
                } else {
                    toDelete.push(lead.id);
                }
            } else {
                seenPhones.set(normalized, lead);
            }
        }

        if (toDelete.length > 0) {
            console.log(`Deleting ${toDelete.length} duplicate leads:`, toDelete);
            await pool.query("DELETE FROM crm_leads WHERE id = ANY($1)", [toDelete]);
        } else {
            console.log("No duplicate leads found.");
        }

        // 3. Update existing leads to PENDENTES if they are in 'Leads'
        const leadsStage = await pool.query("SELECT id FROM crm_stages WHERE name = 'Leads' LIMIT 1");
        const pendingStage = await pool.query("SELECT id FROM crm_stages WHERE name = 'PENDENTES' LIMIT 1");

        if (leadsStage.rows.length > 0 && pendingStage.rows.length > 0) {
            const res = await pool.query("UPDATE crm_leads SET stage_id = $1 WHERE stage_id = $2", [pendingStage.rows[0].id, leadsStage.rows[0].id]);
            console.log(`Moved ${res.rowCount} leads from 'Leads' to 'PENDENTES'`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Error during fix:", err);
        process.exit(1);
    }
}

fix();
