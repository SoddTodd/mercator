import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { isAuthorizedRequest } from '../../../lib/admin-auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/tiff'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB (print files can be large)

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
      return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 400 });
    }

    // Sanitize folder — allow only alphanumeric, dashes, underscores, slashes
    const safeFolder = folder.replace(/[^a-zA-Z0-9_\-/]/g, '').slice(0, 100) || 'mercator';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: safeFolder, resource_type: 'auto' }, (error, res) => {
          if (error || !res) reject(error ?? new Error('Upload failed'));
          else resolve(res as { secure_url: string; public_id: string });
        })
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
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
