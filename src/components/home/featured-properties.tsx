import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { PropertyCard } from '@/components/property/property-card'

async function getFeaturedProperties() {
  return prisma.property.findMany({
    where: { isFeatured: true, status: { not: 'SOLD' } },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { images: { take: 1 } },
  })
}

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties()

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-gold-600 text-sm font-semibold tracking-widest uppercase mb-2">
              Handpicked For You
            </p>
            <h2 className="section-heading text-charcoal-900">Featured Properties</h2>
            <div className="gold-divider mt-4" />
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-charcoal-700 hover:text-gold-600 font-medium transition-colors group"
          >
            View All Properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No featured properties yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 bg-charcoal-950 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-white/60">
              Tell us your requirements. We'll find the perfect property for you within 24 hours.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={`https://wa.me/+918872520002?text=${encodeURIComponent('Hi! I need help finding a property in Tricity.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              WhatsApp Us
            </a>
            <Link href="/contact" className="btn-luxury px-6 py-3 text-sm rounded-lg">
              Get Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
