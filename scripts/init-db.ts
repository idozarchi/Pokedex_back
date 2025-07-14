import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex';

async function initDb() {
  await mongoose.connect(uri);
  const db = mongoose.connection;

  const collections = await db.db!.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);

  const requiredCollections = ['myPokemons', 'allPokemons', 'fights', 'users'];

  for (const name of requiredCollections) {
    if (!collectionNames.includes(name)) {
      await db.createCollection(name);
      console.log(`Created collection: ${name}`);
    } else {
      console.log(`Collection already exists: ${name}`);
    }
  }

  await mongoose.disconnect();
  console.log('DB initialization complete.');
}

initDb().catch((err) => {
  console.error('Error initializing DB:', err);
  process.exit(1);
});
