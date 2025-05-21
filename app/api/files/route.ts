import { NextRequest, NextResponse } from 'next/server'
import { listFiles, getSignedUrlForDownload, deleteFile } from '@/app/lib/r2'
import { getUserStatusForClasa } from '@/app/lib/data'

export async function GET(request: NextRequest) {
  const status = await getUserStatusForClasa(request.url.split('?')[1])
  if(!status) return NextResponse.json({ error: 'Clasa not found' }, { status: 400 })
    console.log(status)
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
  const status = await getUserStatusForClasa(bucket)
  if(status != "profesor") return NextResponse.json({ error: 'Clasa not found' }, { status: 400 })
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
  const status = await getUserStatusForClasa(bucket)
  if(status != "profesor") return NextResponse.json({ error: 'Clasa not found' }, { status: 400 })
  try {
    await deleteFile(bucket, key)
    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 })
  }
}