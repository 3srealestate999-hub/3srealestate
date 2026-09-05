import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { leadCaptureSchema } from '@/lib/validations'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { sendLeadNotification } from '@/lib/notify'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = leadCaptureSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const data = parsed.data
    const { score } = calculateLeadScore(data)

    const existing = await prisma.lead.findFirst({
      where: {
        phone: data.phone,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    })

    if (existing) {
      return NextResponse.json({ message: 'Lead already exists', leadId: existing.id })
    }

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        budget: data.budget || null,
        preferredLocation: data.preferredLocation || null,
        propertyType: data.propertyType || null,
        purpose: data.purpose || null,
        timeline: data.timeline || null,
        score,
        source: 'website_popup',
      },
    })

    // Send email notification
    sendLeadNotification({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      budget: data.budget,
      preferredLocation: data.preferredLocation,
      propertyType: data.propertyType,
      purpose: data.purpose,
      score,
    })

    return NextResponse.json({ success: true, leadId: lead.id, score }, { status: 201 })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status')
  const score = searchParams.get('score')
  const where: any = {}
  if (status) where.status = status
  if (score) where.score = score

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where, orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit, take: limit,
      include: { assignedTo: { select: { name: true, email: true } } },
    }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({ leads, total, page, limit, pages: Math.ceil(total / limit) })
}