const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
// Use Vercel's PORT or default to 3001 for local development
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build (if exists)
app.use(express.static('frontend/dist'));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Placeholder routes - will be implemented later
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/tenants', require('./routes/tenants'));

// Serve frontend routes for SPA
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/frontend/dist/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;