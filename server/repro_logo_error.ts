
const BASE_URL = 'http://localhost:3000/api';

async function main() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'dev.karenfernandes@gmail.com', password: 'Klpf1212!' })
        });

        if (!loginRes.ok) {
            console.error('Login failed:', await loginRes.text());
            // If login failed, maybe server is not running or credentials wrong.
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful.');

        // 2. Get Companies to pick one (or create)
        console.log('Fetching companies...');
        const companiesRes = await fetch(`${BASE_URL}/companies`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!companiesRes.ok) {
            console.error('Failed to get companies:', await companiesRes.text());
            return;
        }

        const companies = await companiesRes.json();
        let companyId;

        if (companies.length > 0) {
            companyId = companies[0].id;
            console.log(`Using existing company ID: ${companyId}`);
        } else {
            console.log('Creating new company...');
            const newCoForm = new FormData();
            newCoForm.append('name', 'Test Company for Logo');
            newCoForm.append('operation_type', 'clientes');

            const createRes = await fetch(`${BASE_URL}/companies`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: newCoForm
            });

            if (!createRes.ok) {
                console.error('Failed to create company:', await createRes.text());
                return;
            }
            const created = await createRes.json();
            companyId = created.id;
            console.log(`Created company ID: ${companyId}`);
        }

        // Test GET Company (with params)
        /*
        console.log(`Testing GET /companies/${companyId}...`);
        const getSingleRes = await fetch(`${BASE_URL}/companies/${companyId}`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        if (!getSingleRes.ok) {
            console.error('GET Company Failed:', await getSingleRes.text());
            return;
        }
        console.log('GET Company Success');
        */

        // 3. Update Company - REMOVE LOGO
        console.log(`Attempting to remove logo for company ${companyId}...`);

        const updateForm = new FormData();
        updateForm.append('name', 'Company Logo Removed');
        updateForm.append('operation_type', 'clientes');
        updateForm.append('remove_logo', 'true');

        // Note: in Node environment, we might need to set boundaries or let headers be auto-set.
        // fetch with FormData usually auto-sets Content-Type to multipart/form-data; boundary=...
        // But we must NOT set Content-Type header manually.

        const updateRes = await fetch(`${BASE_URL}/companies/${companyId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }, // Do NOT set Content-Type!
            body: updateForm
        });

        const status = updateRes.status;
        const text = await updateRes.text();

        console.log(`Update Response [${status}] (See repro_output.html)`);
        const fs = await import('fs'); // dynamic import or require if allowed, or sync
        // simpler:
        // @ts-ignore
        await import('fs/promises').then(fs => fs.writeFile('repro_output.html', text));

    } catch (e) {
        console.error('Script Error:', e);
    }
}

main();
