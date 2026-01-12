require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow same origin in production
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

async function startServer() {
  await initDB();
  
  // API Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/plans', require('./routes/plans'));
  app.use('/api/tickets', require('./routes/tickets'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/about', require('./routes/about'));
  app.use('/api/chat', require('./routes/chat'));

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Flame Cloud server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
