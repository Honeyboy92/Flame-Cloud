require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
// CORS configuration - Allow all in production and dev for debugging
const corsOptions = {
  origin: true, // Reflect or allow current origin
  credentials: true
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API Request] ${req.method} ${req.url}`);
  }
  next();
});
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Synchronous API Routes (Safe because routes themselves handle database lazily)
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/about', require('./routes/about'));
app.use('/api/chat_messages', require('./routes/chat'));

// Consistent aliases for Supabase shim
app.use('/api/yt_partners', require('./routes/admin'));
app.use('/api/location_settings', require('./routes/plans'));
app.use('/api/paid_plans', require('./routes/plans'));
app.use('/api/site_settings', require('./routes/plans'));
app.use('/api/about_content', require('./routes/about'));

// Health check endpoint (Moved to top)
app.get('/api/health', (req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV, time: new Date().toISOString() }));

// Ensure ALL 404s in /api return JSON, not HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize DB and start server IF run directly
async function startServer() {
  try {
    console.log('📦 Initializing database...');
    await initDB();
    console.log('✅ Database initialized');

    if (require.main === module) {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🔥 Flame Cloud server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
    // Don't exit in production/serverless, let the routes handle errors
    if (require.main === module) process.exit(1);
  }
}

// Start server/initialization
if (require.main === module) {
  startServer();
} else {
  // In serverless, just fire and forget the init
  // Or better, we can let the first request trigger it
  initDB().catch(err => console.error('Lazy DB Init Error:', err));
}

module.exports = app;
