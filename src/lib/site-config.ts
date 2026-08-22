// src/lib/site-config.ts
import { prisma } from './prisma'
import { unstable_noStore as noStore } from 'next/cache'

export const siteConfig = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+918872110222',
  phonePrimary: process.env.NEXT_PUBLIC_PHONE_PRIMARY || '+918872520002',
  phoneSecondary: process.env.NEXT_PUBLIC_PHONE_SECONDARY || '+918872110222',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@3srealestate.com',
}

export function getWhatsAppDigits(): string {
  return siteConfig.whatsappNumber.replace(/[^0-9]/g, '')
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${getWhatsAppDigits()}?text=${encodeURIComponent(message)}`
}

export function getPhoneLink(): string {
  return `tel:${siteConfig.phonePrimary.replace(/\s/g, '')}`
}

export async function getLiveConfig() {
  noStore()
  try {
    const settings = await prisma.siteSettings.findMany()
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    return {
      whatsappNumber: map['whatsapp_number'] || siteConfig.whatsappNumber,
      phonePrimary: map['phone_primary'] || siteConfig.phonePrimary,
      phoneSecondary: map['phone_secondary'] || siteConfig.phoneSecondary,
      email: map['email_primary'] || siteConfig.email,
      address: map['address'] || 'SCO 90-91, sector-86, Preet City, near-HDFC bank, First Floor',
      instagramUrl: map['instagram_url'] || '',
      youtubeUrl: map['youtube_url'] || '',
      facebookUrl: map['facebook_url'] || '',
    }
  } catch {
    return {
      whatsappNumber: siteConfig.whatsappNumber,
      phonePrimary: siteConfig.phonePrimary,
      phoneSecondary: siteConfig.phoneSecondary,
      email: siteConfig.email,
      address: 'SCO 90-91, sector-86, Preet City, near-HDFC bank, First Floor',
      instagramUrl: '',
      youtubeUrl: '',
      facebookUrl: '',
    }
  }
}

export type LiveConfig = Awaited<ReturnType<typeof getLiveConfig>>