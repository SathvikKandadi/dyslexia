const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 