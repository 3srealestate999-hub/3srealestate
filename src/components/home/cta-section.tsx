'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Calendar } from 'lucide-react'
import { getPhoneLink, getWhatsAppLink } from '@/lib/site-config'

export function CTASection() {
  return (
    <section className="py-20 bg-gold-gradient relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-white/80 text-lg mb-10">
              Talk to our expert consultants today. Free consultation, no obligation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              
                href={getPhoneLink()}
                className="flex items-center gap-2 bg-white text-gold-700 font-semibold px-7 py-3.5 rounded-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              
                href={getWhatsAppLink('Hi! I want to discuss a property.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-green-600 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <Link
                href="/contact?action=appointment"
                className="flex items-center gap-2 bg-charcoal-950 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-charcoal-800 transition-colors shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                Book Site Visit
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}