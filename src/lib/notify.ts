// src/lib/notify.ts

const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || '3sestate@gmail.com'
const FROM_EMAIL = 'onboarding@resend.dev'

async function sendEmail(subject: string, html: string): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      console.log('Resend API key not configured')
      return false
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `3S Real Estate <onboarding@resend.dev>`,
        to: [NOTIFICATION_EMAIL],
        subject,
        html,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      console.log('Email sent:', data.id)
      return true
    } else {
      console.error('Email failed:', data)
      return false
    }
  } catch (e) {
    console.error('Email error:', e)
    return false
  }
}

// Lead notification
export async function sendLeadNotification(data: {
  fullName: string
  phone: string
  email?: string | null
  budget?: string | null
  preferredLocation?: string | null
  propertyType?: string | null
  purpose?: string | null
  score: string
}): Promise<boolean> {
  const scoreColor = data.score === 'HOT' ? '#ef4444' : data.score === 'WARM' ? '#f97316' : '#3b82f6'
  const scoreEmoji = data.score === 'HOT' ? '🔥' : data.score === 'WARM' ? '🌡️' : '❄️'

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d4960a, #b07407); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🏠 New Lead Alert!</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">3S Real Estate — New Customer Inquiry</p>
      </div>

      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">

        <div style="background: ${scoreColor}15; border: 1px solid ${scoreColor}40; border-radius: 8px; padding: 12px; margin-bottom: 20px; text-align: center;">
          <span style="color: ${scoreColor}; font-weight: bold; font-size: 18px;">${scoreEmoji} ${data.score} LEAD</span>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%;">👤 Full Name</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px;">${data.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📞 Phone</td>
            <td style="padding: 10px 0; font-size: 14px;">
              <a href="tel:${data.phone}" style="color: #d4960a; font-weight: 600;">${data.phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📧 Email</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.email || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">💰 Budget</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.budget || 'Not specified'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📍 Location</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.preferredLocation || 'Not specified'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">🏡 Property Type</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.propertyType || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">🎯 Purpose</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.purpose || 'Not specified'}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px;">⏰ Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <a href="tel:${data.phone}" style="background: linear-gradient(135deg, #d4960a, #b07407); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 4px;">
            📞 Call Now
          </a>
          <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}?text=Hi ${encodeURIComponent(data.fullName)}, I'm calling from 3S Real Estate regarding your property inquiry." style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 4px;">
            💬 WhatsApp
          </a>
        </div>
      </div>

      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
        3S Real Estate — Smart • Secure • Sophisticated
      </p>
    </div>
  `

  return sendEmail(`${scoreEmoji} New ${data.score} Lead — ${data.fullName} | 3S Real Estate`, html)
}

// Inquiry notification
export async function sendInquiryNotification(data: {
  name: string
  phone: string
  email?: string | null
  message?: string | null
  propertyTitle?: string | null
}): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d4960a, #b07407); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">💬 New Property Inquiry!</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Someone is interested in a property</p>
      </div>

      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        ${data.propertyTitle ? `
        <div style="background: #fef9ee; border: 1px solid #d4960a40; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
          <p style="color: #d4960a; font-weight: bold; margin: 0; font-size: 14px;">🏠 Property: ${data.propertyTitle}</p>
        </div>` : ''}

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%;">👤 Name</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px;">${data.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📞 Phone</td>
            <td style="padding: 10px 0; font-size: 14px;">
              <a href="tel:${data.phone}" style="color: #d4960a; font-weight: 600;">${data.phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📧 Email</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.email || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">💬 Message</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.message || 'No message'}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px;">⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <a href="tel:${data.phone}" style="background: linear-gradient(135deg, #d4960a, #b07407); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 4px;">
            📞 Call Now
          </a>
          <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 4px;">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  `

  return sendEmail(`💬 New Inquiry — ${data.name} | 3S Real Estate`, html)
}

// Contact form notification
export async function sendContactNotification(data: {
  name: string
  phone: string
  email?: string | null
  subject?: string | null
  message: string
}): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d4960a, #b07407); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Contact Form</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Someone reached out via contact form</p>
      </div>

      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%;">👤 Name</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px;">${data.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📞 Phone</td>
            <td style="padding: 10px 0; font-size: 14px;">
              <a href="tel:${data.phone}" style="color: #d4960a; font-weight: 600;">${data.phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📧 Email</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.email || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">📋 Subject</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.subject || 'General'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">💬 Message</td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${data.message}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px;">⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <a href="tel:${data.phone}" style="background: linear-gradient(135deg, #d4960a, #b07407); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 4px;">
            📞 Call Now
          </a>
          <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin: 4px;">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  `

  return sendEmail(`📩 Contact Form — ${data.name} | 3S Real Estate`, html)
}