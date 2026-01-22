import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, Db, ObjectId } from 'mongodb';
import { SignJWT, jwtVerify } from 'jose';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// ============================================================================
// Database Connection
// ============================================================================
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not configured');
  
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  cachedDb = cachedClient.db(process.env.MONGO_DB_NAME || 'gogo-impact-report');
  return cachedDb;
}

// ============================================================================
// JWT Authentication
// ============================================================================
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'fallback-secret-change-in-production'
);
const JWT_EXPIRY = '7d';

interface JWTPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  admin: boolean;
}

async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

function getTokenFromRequest(req: VercelRequest): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  
  // Check cookie
  const cookies = req.headers.cookie;
  if (cookies) {
    const match = cookies.match(/auth_token=([^;]+)/);
    if (match) return match[1];
  }
  
  return null;
}

// ============================================================================
// S3 Upload
// ============================================================================
const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  } : undefined,
});

function inferExtensionFromContentType(contentType: string | undefined): string | null {
  if (!contentType) return null;
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
  };
  return map[contentType] ?? null;
}

// ============================================================================
// Collection Mapping
// ============================================================================
const collectionMap: Record<string, string> = {
  'hero': 'hero',
  'mission': 'mission',
  'defaults': 'defaults',
  'population': 'population',
  'financial': 'financial',
  'method': 'method',
  'curriculum': 'curriculum',
  'impact-section': 'impact_section',
  'hear-our-impact': 'hear_our_impact',
  'testimonials': 'testimonials',
  'national-impact': 'national_impact',
  'flex-a': 'flex_a',
  'flex-b': 'flex_b',
  'flex-c': 'flex_c',
  'impact-levels': 'impact_levels',
  'partners': 'partners',
  'footer': 'footer',
};

// ============================================================================
// Main Handler
// ============================================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract path
  const queryPath = req.query.path as string | undefined;
  const urlPath = req.url?.split('?')[0]?.replace(/^\/api/, '') || '/';
  const path = queryPath ? `/${queryPath}` : urlPath;
  
  // CORS
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDb();
    const slug = (req.query.slug as string) || 'impact-report';

    // ========================================================================
    // Health Check
    // ========================================================================
    if (path === '/health' || path === '/') {
      return res.json({ status: 'ok', env: process.env.NODE_ENV });
    }

    // ========================================================================
    // Auth Routes
    // ========================================================================
    if (path === '/auth/login' && req.method === 'POST') {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const payload: JWTPayload = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.autopromote || false,
      };
      
      const token = await createToken(payload);
      
      // Set httpOnly cookie
      res.setHeader('Set-Cookie', [
        `auth_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}`,
      ]);
      
      return res.json(payload);
    }

    if (path === '/auth/me') {
      const token = getTokenFromRequest(req);
      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const payload = await verifyToken(token);
      if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      
      return res.json(payload);
    }

    if (path === '/auth/logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', [
        'auth_token=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0',
      ]);
      return res.json({ message: 'Logged out successfully' });
    }

    // ========================================================================
    // Protected Routes - Check Auth
    // ========================================================================
    const requiresAuth = (
      req.method === 'PUT' || 
      req.method === 'POST' || 
      req.method === 'DELETE' ||
      path.startsWith('/uploads') ||
      path.startsWith('/media') ||
      path.startsWith('/snapshots')
    );
    
    let user: JWTPayload | null = null;
    if (requiresAuth) {
      const token = getTokenFromRequest(req);
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      user = await verifyToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    }

    // ========================================================================
    // Upload Routes
    // ========================================================================
    if (path === '/uploads/sign' && req.method === 'POST') {
      const { contentType, extension, folder, key: providedKey } = req.body || {};
      
      if (!contentType) {
        return res.status(400).json({ error: 'contentType is required' });
      }

      let key: string;
      if (providedKey && typeof providedKey === 'string') {
        const safeKey = providedKey.replace(/[^a-zA-Z0-9/_\.-]/g, '');
        if (!safeKey || safeKey.startsWith('/')) {
          return res.status(400).json({ error: 'Invalid key' });
        }
        key = safeKey;
      } else {
        const datePrefix = new Date().toISOString().slice(0, 10);
        const safeExt = (extension ?? '').replace(/[^a-zA-Z0-9]/g, '') || inferExtensionFromContentType(contentType) || 'bin';
        const baseFolder = folder?.replace(/[^a-zA-Z0-9/_-]/g, '') || 'media';
        key = `${baseFolder}/${datePrefix}/${crypto.randomUUID()}.${safeExt}`;
      }

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET as string,
        Key: key,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
      const publicUrlBase = process.env.CDN_BASE_URL ?? `https://${process.env.S3_BUCKET}.s3.amazonaws.com`;

      return res.json({
        uploadUrl,
        key,
        publicUrl: `${publicUrlBase}/${key}`,
        expiresInSeconds: 60,
      });
    }

    // ========================================================================
    // Media Routes
    // ========================================================================
    if (path === '/media' && req.method === 'POST') {
      const { key, publicUrl, contentType, bytes, width, height, duration, alt, tag, entityType, entityId } = req.body || {};

      if (!key || !publicUrl) {
        return res.status(400).json({ error: 'key and publicUrl are required' });
      }

      const doc = {
        key,
        url: publicUrl,
        contentType: contentType ?? null,
        bytes: typeof bytes === 'number' ? bytes : null,
        width: typeof width === 'number' ? width : null,
        height: typeof height === 'number' ? height : null,
        duration: typeof duration === 'number' ? duration : null,
        alt: typeof alt === 'string' ? alt : null,
        tag: typeof tag === 'string' ? tag : null,
        entity: entityType && entityId ? { type: entityType, id: String(entityId) } : null,
        createdAt: new Date(),
      };

      const result = await db.collection('media').insertOne(doc);
      return res.status(201).json({ id: result.insertedId, data: doc });
    }

    // ========================================================================
    // Snapshot Routes
    // ========================================================================
    if (path === '/snapshots') {
      if (req.method === 'GET') {
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
        const skip = Math.max(0, parseInt(req.query.skip as string) || 0);

        const snapshots = await db.collection('snapshots')
          .find({}, { projection: { data: 0 } })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        const total = await db.collection('snapshots').countDocuments();

        return res.json({ snapshots, total, limit, skip });
      }

      if (req.method === 'POST') {
        const { name, trigger } = req.body || {};

        // Fetch all section data
        const data: Record<string, unknown> = {};
        for (const [apiName, collName] of Object.entries(collectionMap)) {
          const doc = await db.collection(collName).findOne({ slug });
          if (doc) {
            const { _id, ...rest } = doc;
            data[apiName] = rest;
          }
        }

        const snapshot = {
          name: name || `Snapshot ${new Date().toISOString()}`,
          trigger: trigger || 'manual',
          createdAt: new Date(),
          data,
        };

        const result = await db.collection('snapshots').insertOne(snapshot);
        return res.status(201).json({ 
          snapshot: { 
            _id: result.insertedId, 
            name: snapshot.name, 
            trigger: snapshot.trigger, 
            createdAt: snapshot.createdAt 
          } 
        });
      }
    }

    if (path === '/snapshots/export' && req.method === 'GET') {
      const data: Record<string, unknown> = {};
      for (const [apiName, collName] of Object.entries(collectionMap)) {
        const doc = await db.collection(collName).findOne({ slug });
        if (doc) {
          const { _id, ...rest } = doc;
          data[apiName] = rest;
        }
      }

      const exportData = {
        _meta: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          type: 'gogo-impact-config',
        },
        ...data,
      };

      const filename = `gogo-impact-config-${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.json(exportData);
    }

    const snapshotIdMatch = path.match(/^\/snapshots\/([a-f0-9]{24})$/);
    if (snapshotIdMatch) {
      const id = snapshotIdMatch[1];

      if (req.method === 'GET') {
        const snapshot = await db.collection('snapshots').findOne({ _id: new ObjectId(id) });
        if (!snapshot) {
          return res.status(404).json({ error: 'Snapshot not found' });
        }
        return res.json({ snapshot });
      }

      if (req.method === 'DELETE') {
        const result = await db.collection('snapshots').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Snapshot not found' });
        }
        return res.json({ success: true });
      }
    }

    // ========================================================================
    // Impact Content Routes
    // ========================================================================
    const impactMatch = path.match(/^\/impact\/(.+)$/);
    if (impactMatch) {
      const section = impactMatch[1];
      const collectionName = collectionMap[section];
      
      if (!collectionName) {
        return res.status(404).json({ error: 'Unknown section', section });
      }

      if (req.method === 'GET') {
        const doc = await db.collection(collectionName).findOne({ slug });
        if (!doc) {
          return res.status(404).json({ error: 'Content not found' });
        }
        const { _id, slug: storedSlug, ...data } = doc;
        return res.json({ data });
      }

      if (req.method === 'PUT') {
        const body = req.body || {};
        await db.collection(collectionName).updateOne(
          { slug },
          { $set: { ...body, slug, updatedAt: new Date() } },
          { upsert: true }
        );
        const doc = await db.collection(collectionName).findOne({ slug });
        const { _id, slug: storedSlug, ...data } = doc || {};
        return res.json({ data });
      }
    }

    return res.status(404).json({ error: 'Not found', path });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
