import mongoose from 'mongoose';

// Use environment variable or fallback to development DB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://IPUInsight:IPUInsight365@ipuinsight.t7n1yul.mongodb.net/?retryWrites=true&w=majority&appName=IPUInsight';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Log environment for debugging
console.log(`Connecting to MongoDB in ${process.env.NODE_ENV} mode`);

// Global mongoose cache
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    };

    try {
      console.log('Connecting to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      const conn = await cached.promise;
      console.log('MongoDB connected successfully');
      return conn;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('Failed to get MongoDB connection:', e);
    throw e;
  }
}

export default dbConnect;
