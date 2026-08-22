
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

    // Extract relation fields separately so Prisma can use nested creates.
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

        // Property images are a relation, so they must use `create`.
        images: images?.length
          ? {
              create: images.map((image: any, index: number) => ({
                url: image.url,
                alt: image.alt || null,
                order: image.order ?? index,
                isPrimary: image.isPrimary ?? false,
              })),
            }
          : undefined,

        // Property amenities are also a relation.
        amenities: amenities?.length
          ? {
              create: amenities.map((amenity: any) => ({
                name: amenity.name,
                icon: amenity.icon || null,
              })),
            }
          : undefined,

        // Nearby facilities are a relation.
        nearbyFacility: nearbyFacility?.length
          ? {
              create: nearbyFacility.map((facility: any) => ({
                name: facility.name,
                type: facility.type,
                distance: facility.distance,
              })),
            }
          : undefined,
      },

      include: {
        images: true,
        amenities: true,
        nearbyFacility: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        property,
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.error('Property creation error:', e)

    return NextResponse.json(
      {
        error: e.message || 'Server error',
      },
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

  try {
    const { searchParams } = new URL(req.url)

    const page = Math.max(
      1,
      parseInt(searchParams.get('page') || '1', 10)
    )

    const limit = Math.max(
      1,
      parseInt(searchParams.get('limit') || '20', 10)
    )

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

          images: true,
          amenities: true,
          nearbyFacility: true,
        },
      }),

      prisma.property.count({
        where,
      }),
    ])

    return NextResponse.json({
      properties,
      total,
      pages: Math.ceil(total / limit),
    })
  } catch (e: any) {
    console.error('Property fetch error:', e)

    return NextResponse.json(
      {
        error: e.message || 'Server error',
      },
      { status: 500 }
    )
  }
}

