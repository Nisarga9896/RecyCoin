import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let memoryServer = null;

export async function connectDB() {
  const mode = process.env.DB_MODE || 'memory';
  let uri = process.env.MONGODB_URI;

  if (mode === 'memory') {
    const dbPath = path.resolve(__dirname, process.env.DB_PATH || './.data/mongodb');
    const binRoot = path.resolve(__dirname, './.data/mongodb-bin');
    console.log('⚙️  Starting embedded MongoDB (persistent) at', dbPath);
    memoryServer = await MongoMemoryServer.create({
      instance: { dbPath, dbName: 'ewaste', storageEngine: 'wiredTiger', port: 27017 },
      binary: { downloadDir: binRoot },
    });
    uri = memoryServer.getUri('ewaste');
  }

  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

export async function disconnectDB() {
  try {
    await mongoose.connection.db?.command({ fsync: 1 });
  } catch {
    // fsync is not supported by every MongoDB deployment; ignore failures.
  }
  await mongoose.disconnect();
  if (memoryServer) {
    // Give the embedded engine a moment to checkpoint before shutting down.
    await new Promise((resolve) => setTimeout(resolve, 500));
    await memoryServer.stop({ doCleanup: false, force: false });
    memoryServer = null;
  }
}