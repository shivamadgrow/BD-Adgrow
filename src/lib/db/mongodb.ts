import { MongoClient, Db } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable. Set it in .env.');
  }
  return new MongoClient(uri).connect();
}

// Connection is created lazily, only when getDb() is first called by an actual request —
// never at module-import time. Next.js's build step imports every API route module to
// statically analyze it, so any top-level connection attempt here would run during `next
// build` itself and crash the build if MONGODB_URI isn't visible at build time.
function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClientPromise();
    }
    return global._mongoClientPromise;
  }
  return createClientPromise();
}

export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB || 'adgrow_bd';
  const client = await getClientPromise();
  return client.db(dbName);
}
