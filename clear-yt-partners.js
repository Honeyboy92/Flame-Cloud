const { initDB, prepare } = require('./server/database');

async function clearPartners() {
    console.log('--- Clearing YT Partners ---');
    try {
        await initDB();
        prepare('DELETE FROM yt_partners').run();
        console.log('✅ All YT Partners removed successfully.');
    } catch (err) {
        console.error('❌ Error clearing partners:', err);
    }
}

clearPartners();
