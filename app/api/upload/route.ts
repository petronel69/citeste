import { getSignedUrlForUpload } from '@/app/lib/r2'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { fileName, fileType, bucket } = await request.json()

  if(fileType !== 'application/pdf') {
    return NextResponse.json(
      { error: 'Acest tip de fișier nu poate fi încărcat' },
      { status: 400 }
    )
  }

  try {
    const signedUrl = await getSignedUrlForUpload(bucket, fileName, fileType)
    return NextResponse.json({ signedUrl, error: null })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error generating signed URL' },
      { status: 500 }
    )
  }
}