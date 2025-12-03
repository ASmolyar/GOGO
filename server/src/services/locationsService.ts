import { getDatabase } from '../config/database.js';

export interface LocationsContent {
  enabled?: boolean | null;
  title?: string | null;
}

export interface LocationsDocument extends LocationsContent {
  _id?: string;
  slug?: string;
  updatedAt?: Date;
}

const LOCATIONS_COLLECTION = 'locations';

export async function findLocationsBySlug(slug = 'impact-report'): Promise<LocationsDocument | null> {
  const db = await getDatabase();
  const collection = db.collection<LocationsDocument>(LOCATIONS_COLLECTION);
  const doc = await collection.findOne({ slug });
  return doc ?? null;
}

export async function upsertLocationsBySlug(slug: string, data: LocationsContent): Promise<LocationsDocument> {
  const db = await getDatabase();
  const collection = db.collection<LocationsDocument>(LOCATIONS_COLLECTION);

  const now = new Date();
  const update = {
    $set: {
      ...data,
      slug,
      updatedAt: now,
    },
  };

  await collection.updateOne({ slug }, update, { upsert: true });
  const saved = await collection.findOne({ slug });
  return saved as LocationsDocument;
}

