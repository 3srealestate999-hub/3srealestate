import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { inquirySchema } from '@/lib/validations'
import { sendWhatsAppNotification, formatInquiryMessage } from '@/lib/notify'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = inquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        message: parsed.data.message || null,
        propertyId: parsed.data.propertyId || null,
      },
      include: {
        property: { select: { title: true } },
      },
    })

    // Send WhatsApp notification
    const message = formatInquiryMessage({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      message: parsed.data.message,
      propertyTitle: inquiry.property?.title,
    })
    sendWhatsAppNotification(message) // fire and forget

    return NextResponse.json({ success: true, inquiryId: inquiry.id }, { status: 201 })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}