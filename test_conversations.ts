const testGetConversations = async () => {
    try {
        console.log('Fetching conversations from http://localhost:3000/api/evolution/conversations...');
        const res = await fetch('http://localhost:3000/api/evolution/conversations');
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Data:', JSON.stringify(data, null, 2));
        } else {
            const text = await res.text();
            console.log('Error Body:', text);
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
};

testGetConversations();
