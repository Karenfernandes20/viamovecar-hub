
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: 'postgresql://postgres.hdwubhvmzfggsrtgkdlv:bWAxkRV4Gb7VRw88@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Renaming Stages...");
        await pool.query("UPDATE crm_stages SET name = 'PENDENTES' WHERE id = 1");
        await pool.query("UPDATE crm_stages SET name = 'ABERTOS' WHERE id = 7");
        await pool.query("UPDATE crm_stages SET name = 'FECHADOS' WHERE id = 8");

        console.log("Checking for company_id in crm_leads...");
        const leadCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'crm_leads' AND column_name = 'company_id'");

        if (leadCols.rows.length === 0) {
            console.log("Adding company_id to crm_leads...");
            await pool.query("ALTER TABLE crm_leads ADD COLUMN company_id INTEGER REFERENCES companies(id)");
            await pool.query("UPDATE crm_leads SET company_id = 1 WHERE company_id IS NULL");
        }

        console.log("De-duplicating leads by phone...");
        // Keep highest ID lead for each phone
        await pool.query(`
            DELETE FROM crm_leads 
            WHERE id NOT IN (
                SELECT MAX(id) 
                FROM crm_leads 
                GROUP BY phone, company_id
            )
        `);

        console.log("Adding UNIQUE constraint to crm_leads...");
        await pool.query(`
            ALTER TABLE crm_leads 
            DROP CONSTRAINT IF EXISTS crm_leads_phone_company_unique;
            
            ALTER TABLE crm_leads 
            ADD CONSTRAINT crm_leads_phone_company_unique UNIQUE (phone, company_id);
        `);

        console.log("De-duplicating whatsapp_contacts...");
        await pool.query(`
            DELETE FROM whatsapp_contacts 
            WHERE id NOT IN (
                SELECT MAX(id) 
                FROM whatsapp_contacts 
                GROUP BY jid, instance, company_id
            )
        `);

        console.log("Adding UNIQUE constraint to whatsapp_contacts...");
        await pool.query(`
            ALTER TABLE whatsapp_contacts 
            DROP CONSTRAINT IF EXISTS whatsapp_contacts_jid_instance_comp_unique;

            ALTER TABLE whatsapp_contacts 
            ADD CONSTRAINT whatsapp_contacts_jid_instance_comp_unique UNIQUE (jid, instance, company_id);
        `);

        console.log("Migration successful!");
        process.exit(0);
    } catch (e) {
        console.error("Migration fatal error:", e);
        process.exit(1);
    }
}

migrate();
