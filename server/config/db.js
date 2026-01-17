// MongoDB Connection Configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    
    // Don't exit in dev mode - keep server running
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  DEV MODE: Server will continue without MongoDB');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
