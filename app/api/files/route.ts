import { NextRequest, NextResponse } from 'next/server'
import { listFiles, getSignedUrlForDownload, deleteFile } from '@/app/lib/r2'

export async function GET(request: NextRequest) {
  const bucket = request.url.split('?')[1]
  try {
    const files = await listFiles(bucket)
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: 'Error listing files' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { key, bucket } = await request.json()

  try {
    const signedUrl = await getSignedUrlForDownload(bucket, key)
    return NextResponse.json({ signedUrl })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error generating download URL' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { key, bucket } = await request.json()

  try {
    await deleteFile(bucket, key)
    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 })
  }
}