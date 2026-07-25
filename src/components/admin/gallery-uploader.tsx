import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await auth()

  if (
    !session ||
    !['ADMIN', 'SUPER_ADMIN', 'AGENT'].includes(session.user.role as string)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const slug = slugify(body.title) + '-' + Date.now().toString(36)

    const {
      amenities,
      nearbyFacility,
      images,
      ...propertyData
    } = body

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        slug,

        amenities: amenities?.length
          ? { create: amenities }
          : undefined,

        nearbyFacility: nearbyFacility?.length
          ? { create: nearbyFacility }
          : undefined,

        images: images?.length
          ? { create: images }
          : undefined,
      },

      include: {
        amenities: true,
        nearbyFacility: true,
        images: true,
      },
    })

    return NextResponse.json(
      { success: true, property },
      { status: 201 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()

  if (
    !session ||
    !['ADMIN', 'SUPER_ADMIN', 'AGENT'].includes(session.user.role as string)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status')

  const where: any = {}

  if (status) {
    where.status = status
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ])

  return NextResponse.json({
    properties,
    total,
    pages: Math.ceil(total / limit),
  })
}