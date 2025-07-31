const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with additional options for Windows
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4, // Force IPv4
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('💡 Make sure MongoDB service is running: net start MongoDB');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drives', require('./routes/drives'));
app.use('/api/interest', require('./routes/interest'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/user', require('./routes/user'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Test at: http://localhost:${PORT}/api/test`);
});
