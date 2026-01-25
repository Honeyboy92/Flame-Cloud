async function diag() {
    console.log('--- Flame Cloud Chat Diagnostic (Admin) ---');

    // 1. Login as Admin
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'flamecloud@gmail.com', password: 'GSFY!25V$' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const { token, user } = await loginRes.json();
    console.log(`Logged in as ADMIN ${user.id} (${user.username})`);

    // 2. Fetch Chat Messages (Admin - all messages)
    // Admin doesn't use OR but fetches all if not selected
    const url = `http://localhost:5000/api/chat_messages`;
    console.log(`Fetching: ${url}`);

    const chatRes = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!chatRes.ok) {
        console.error('Chat fetch failed:', await chatRes.text());
        return;
    }

    const messages = await chatRes.json();
    console.log(`Found ${messages.length} messages.`);
    if (messages.length > 0) {
        console.log('Last message:', messages[messages.length - 1].message);
    }
}

diag().catch(console.error);
