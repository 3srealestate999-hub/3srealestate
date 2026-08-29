import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { images: true, amenities: true, nearbyFacility: true },
  })
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ property })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { amenities, images, ...propertyData } = body

    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...propertyData,
        amenities: amenities ? {
          deleteMany: {},
          create: amenities,
        } : undefined,
        images: images ? {
          deleteMany: {},
          create: images,
        } : undefined,
      },
    })
    return NextResponse.json({ success: true, property })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.property.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}