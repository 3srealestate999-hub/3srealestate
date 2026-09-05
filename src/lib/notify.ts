// src/lib/notify.ts

export async function sendWhatsAppNotification(message: string): Promise<boolean> {
  try {
    const phone = process.env.OWNER_WHATSAPP_NUMBER
    const apiKey = process.env.CALLMEBOT_API_KEY

    if (!phone || !apiKey) {
      console.log('WhatsApp notification not configured')
      return false
    }

    const encodedMessage = encodeURIComponent(message)
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`

    const res = await fetch(url)
    const text = await res.text()
    console.log('WhatsApp notification sent:', text)
    return res.ok
  } catch (e) {
    console.error('WhatsApp notification failed:', e)
    return false
  }
}

export function formatLeadMessage(data: {
  fullName: string
  phone: string
  email?: string
  budget?: string
  preferredLocation?: string
  propertyType?: string
  purpose?: string
}): string {
  return `🏠 *NEW LEAD - 3S Real Estate*

👤 *Name:* ${data.fullName}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email || 'Not provided'}
💰 *Budget:* ${data.budget || 'Not specified'}
📍 *Location:* ${data.preferredLocation || 'Not specified'}
🏡 *Property Type:* ${data.propertyType || 'Not specified'}
🎯 *Purpose:* ${data.purpose || 'Not specified'}

⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Reply to this lead immediately! 🚀`
}

export function formatInquiryMessage(data: {
  name: string
  phone: string
  email?: string
  message?: string
  propertyTitle?: string
}): string {
  return `💬 *NEW INQUIRY - 3S Real Estate*

👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email || 'Not provided'}
🏠 *Property:* ${data.propertyTitle || 'General Inquiry'}
💬 *Message:* ${data.message || 'No message'}

⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Contact this customer now! 📲`
}

export function formatContactMessage(data: {
  name: string
  phone: string
  email?: string
  subject?: string
  message: string
}): string {
  return `📩 *CONTACT FORM - 3S Real Estate*

👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email || 'Not provided'}
📋 *Subject:* ${data.subject || 'General'}
💬 *Message:* ${data.message}

⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Respond promptly! ✅`
}