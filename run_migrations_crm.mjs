
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function runSQL() {
    try {
        console.log("Renaming Stages...");

        // Ensure Pendentes, Abertos, Fechados exist
        // We'll rename the 3 most common/first ones or create them.
        // Actually, let's just update based on what we found.

        // ID 1 (Leads) -> PENDENTES
        // ID 9 (Leads) -> PENDENTES (Wait, why two Leads?)
        // ID 7 (Clientes premiun) -> ABERTOS
        // ID 8 (teste) -> FECHADOS

        await pool.query("UPDATE crm_stages SET name = 'PENDENTES' WHERE id = 1");
        await pool.query("UPDATE crm_stages SET name = 'ABERTOS' WHERE id = 7");
        await pool.query("UPDATE crm_stages SET name = 'FECHADOS' WHERE id = 8");
        await pool.query("UPDATE crm_stages SET name = 'LEADS LEGACY' WHERE id = 9");

        console.log("Cleaning up duplicates before adding constraint...");
        // De-duplicate crm_leads (keep highest ID)
        await pool.query(`
            DELETE FROM crm_leads 
            WHERE id NOT IN (
                SELECT MAX(id) 
                FROM crm_leads 
                GROUP BY phone, company_id
            )
        `);

        console.log("Adding UNIQUE constraints...");

        // crm_leads: phone + company_id
        await pool.query(`
            ALTER TABLE crm_leads 
            DROP CONSTRAINT IF EXISTS crm_leads_phone_company_unique;
            
            ALTER TABLE crm_leads 
            ADD CONSTRAINT crm_leads_phone_company_unique UNIQUE (phone, company_id);
        `);

        // whatsapp_contacts: jid + instance + company_id
        await pool.query(`
             ALTER TABLE whatsapp_contacts 
             DROP CONSTRAINT IF EXISTS whatsapp_contacts_jid_instance_comp_unique;

             ALTER TABLE whatsapp_contacts 
             ADD CONSTRAINT whatsapp_contacts_jid_instance_comp_unique UNIQUE (jid, instance, company_id);
        `);

        console.log("SQL Updates completed!");
        process.exit(0);
    } catch (e) {
        console.error("SQL Error:", e);
        process.exit(1);
    }
}
runSQL();
