import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/easyshop';

async function rollbackMigration() {
  console.log('Connecting to MongoDB for migration rollback...');
  await mongoose.connect(MONGODB_URI);

  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not initialized');
    }
    console.log('Cleaning up seed migration collections...');
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      if (col.name.startsWith('temp_') || col.name.endsWith('_migration_backup')) {
        console.log(`Dropping temporary collection: ${col.name}`);
        await db.collection(col.name).drop();
      }
    }
    console.log('Rollback cleanup completed successfully.');
  } catch (err) {
    console.error('Error during rollback:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

rollbackMigration();
