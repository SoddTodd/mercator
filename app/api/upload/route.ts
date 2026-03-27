import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { isAuthorizedRequest } from '../../../lib/admin-auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/tiff', 'application/pdf'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB default limit for print-ready files
const MAX_FILE_SIZE_MB = Math.floor(MAX_FILE_SIZE / (1024 * 1024));

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getFileExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && fromName.length <= 10) {
    return fromName;
  }

  const fromMime = file.type.split('/')[1]?.toLowerCase();
  if (!fromMime) return 'bin';
  if (fromMime === 'jpeg') return 'jpg';
  if (fromMime.includes('+')) return fromMime.split('+')[0];
  return fromMime;
}

function buildPublicUrl(key: string) {
  const customBase = getRequiredEnv('R2_PUBLIC_BASE_URL');
  return `${customBase.replace(/\/$/, '')}/${key}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) || 'mercator';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File exceeds ${MAX_FILE_SIZE_MB} MB limit` }, { status: 400 });
    }

    // Sanitize folder — allow only alphanumeric, dashes, underscores, slashes
    const safeFolder = folder.replace(/[^a-zA-Z0-9_\-/]/g, '').slice(0, 100) || 'mercator';

    const accountId = getRequiredEnv('R2_ACCOUNT_ID');
    const accessKeyId = getRequiredEnv('R2_ACCESS_KEY_ID');
    const secretAccessKey = getRequiredEnv('R2_SECRET_ACCESS_KEY');
    const bucket = getRequiredEnv('R2_BUCKET_NAME');

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    const extension = getFileExtension(file);
    const key = `${safeFolder}/${Date.now()}-${randomUUID()}.${extension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || undefined,
      })
    );

    return NextResponse.json({
      url: buildPublicUrl(key),
      key,
    });
  } catch (err) {
    console.error('[upload] error:', err);
    let message = 'Upload failed';
    if (err instanceof Error) {
      message = err.message;
    } else if (err && typeof err === 'object') {
      const e = err as Record<string, unknown>;
      message = String(e.message ?? e.error ?? e.http_code ?? JSON.stringify(err));
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
