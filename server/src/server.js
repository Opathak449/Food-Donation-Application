require('dotenv').config();
const app = require('./app');
const { initDb } = require('./database/db');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize database
initDb();

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
