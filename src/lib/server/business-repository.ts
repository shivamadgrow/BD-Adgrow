import { getDb } from '@/lib/db/mongodb';
import { Business } from '@/types';

const COLLECTION = 'businesses';

export async function getAllBusinesses(): Promise<Business[]> {
  const db = await getDb();
  const col = db.collection<Business>(COLLECTION);
  return col.find({}, { projection: { _id: 0 } }).toArray() as Promise<Business[]>;
}
