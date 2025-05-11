import { getElevi, kickElev, acceptElev } from '@/app/lib/data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clasa = request.url.split('?')[1]
  if(!clasa) return NextResponse.json({ error: 'No clasa provided' }, { status: 400 })
  try {
    const elevi = await getElevi(clasa)
    return NextResponse.json(elevi)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching elevi' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { id_clasa, id_elev } = await request.json()
  console.log(id_clasa, id_elev)
  try {
    const elevi = await kickElev(id_clasa, id_elev)
    return NextResponse.json(elevi)
  } catch (error) {
    return NextResponse.json({ error: 'Error kicking elev ' + id_elev }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { id_clasa, id_elev } = await request.json()
  try {
    const elevi = await acceptElev(id_clasa, id_elev)
    return NextResponse.json(elevi)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching elev ' + id_elev  }, { status: 500 })
  }
}