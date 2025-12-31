import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createMediaItem, getMediaItems, getUploadPath, getUploadUrl } from '@/lib/cms';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await getMediaItems();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const createdItems = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalFilename = file.name;
      const ext = path.extname(originalFilename);
      const baseName = path.basename(originalFilename, ext);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).slice(2, 7);
      const filename = `${baseName}-${timestamp}-${randomStr}${ext}`;

      const filePath = getUploadPath(filename);
      await writeFile(filePath, buffer);

      // Get image dimensions if it's an image
      let width: number | undefined;
      let height: number | undefined;

      if (file.type.startsWith('image/')) {
        try {
          const metadata = await sharp(buffer).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch {
          // Not a valid image or sharp doesn't support it
        }
      }

      const item = await createMediaItem({
        filename,
        originalFilename,
        mimeType: file.type,
        size: file.size,
        url: getUploadUrl(filename),
        width,
        height,
      });

      createdItems.push(item);
    }

    return NextResponse.json(createdItems, { status: 201 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
