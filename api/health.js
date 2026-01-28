module.exports = (req, res) => {
    res.json({
        status: 'ok',
        message: 'Isolated Vercel function is working',
        env: {
            NODE_ENV: process.env.NODE_ENV,
            HAS_DB_URL: !!process.env.DATABASE_URL,
            HAS_JWT_SECRET: !!process.env.JWT_SECRET
        },
        time: new Date().toISOString()
    });
};
