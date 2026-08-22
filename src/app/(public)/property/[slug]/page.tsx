import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPriceINR, formatDate } from '@/lib/utils'
import { Bed, Bath, Car, Square, MapPin, CheckCircle, Phone, MessageCircle, Calendar, Building, Shield } from 'lucide-react'
import { InquiryForm } from '@/components/property/inquiry-form'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

async function getProperty(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: true,
      nearbyFacility: true,
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.slug)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: property.metaTitle || `${property.title} | 3S Real Estate`,
    description: property.metaDescription || property.description.slice(0, 160),
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = await getProperty(params.slug)
  if (!property) notFound()

  const price = property.priceLabel || formatPriceINR(property.price)
  const allImages = [property.coverImage, ...property.images.map((i) => i.url)].slice(0, 6)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-gold-600">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-gold-600">Properties</Link>
          <span>/</span>
          <span className="text-charcoal-800 truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden">
              {allImages.map((src, i) => (
                <div key={i} className={`relative bg-gray-200 ${i === 0 ? 'col-span-2 md:col-span-2 row-span-2 h-72 md:h-80' : 'h-36 md:h-[152px]'}`}>
                  <Image src={src} alt={`${property.title} image ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                </div>
              ))}
            </div>

            {/* Title and price */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {property.isFeatured && <span className="badge-luxury text-xs">⭐ Featured</span>}
                    {property.isLuxury && <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">💎 Luxury</span>}
                    <span className="bg-charcoal-100 text-charcoal-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {property.type.charAt(0) + property.type.slice(1).toLowerCase()}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${property.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {property.status === 'AVAILABLE' ? '✓ Available' : property.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-charcoal-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-heading font-bold text-gold-600">{price}</p>
                  {property.purpose === 'RENT' && <p className="text-gray-400 text-xs">per month</p>}
                  {property.investmentReturn && (
                    <p className="text-green-600 text-sm font-semibold mt-1">📈 {property.investmentReturn}% Expected Returns</p>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><Bed className="w-4 h-4 text-blue-500" /></div>
                    <div><p className="text-xs text-gray-400">Bedrooms</p><p className="font-semibold text-charcoal-800">{property.bedrooms} BHK</p></div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center"><Bath className="w-4 h-4 text-green-500" /></div>
                    <div><p className="text-xs text-gray-400">Bathrooms</p><p className="font-semibold text-charcoal-800">{property.bathrooms}</p></div>
                  </div>
                )}
                {property.parking && (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center"><Car className="w-4 h-4 text-purple-500" /></div>
                    <div><p className="text-xs text-gray-400">Parking</p><p className="font-semibold text-charcoal-800">{property.parking}</p></div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center"><Square className="w-4 h-4 text-amber-500" /></div>
                  <div><p className="text-xs text-gray-400">Area</p><p className="font-semibold text-charcoal-800">{property.area} {property.areaUnit}</p></div>
                </div>
              </div>

              {/* Details grid */}
              {(property.furnishing || property.possession || property.facing || property.builderName) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                  {property.furnishing && <div><p className="text-xs text-gray-400">Furnishing</p><p className="text-sm font-medium text-charcoal-700">{property.furnishing.replace('_', ' ')}</p></div>}
                  {property.possession && <div><p className="text-xs text-gray-400">Possession</p><p className="text-sm font-medium text-charcoal-700">{property.possession.replace(/_/g, ' ')}</p></div>}
                  {property.facing && <div><p className="text-xs text-gray-400">Facing</p><p className="text-sm font-medium text-charcoal-700">{property.facing}</p></div>}
                  {property.builderName && <div><p className="text-xs text-gray-400">Builder</p><p className="text-sm font-medium text-charcoal-700">{property.builderName}</p></div>}
                  {property.reraNumber && <div><p className="text-xs text-gray-400">RERA No.</p><p className="text-sm font-medium text-charcoal-700">{property.reraNumber}</p></div>}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-heading font-semibold text-xl text-charcoal-900 mb-4">About This Property</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="font-heading font-semibold text-xl text-charcoal-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-sm text-gray-600">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby */}
            {property.nearbyFacility.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="font-heading font-semibold text-xl text-charcoal-900 mb-4">Nearby Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.nearbyFacility.map((facility) => (
                    <div key={facility.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gold-500" />
                        <span className="text-sm text-charcoal-700">{facility.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{facility.type}</span>
                      </div>
                      <span className="text-xs text-gray-500">{facility.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {property.mapEmbedUrl && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="font-heading font-semibold text-xl text-charcoal-900 mb-4">Location Map</h2>
                <div className="rounded-xl overflow-hidden h-64">
                  <iframe src={property.mapEmbedUrl} width="100%" height="100%" className="border-0" allowFullScreen loading="lazy" />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — sticky sidebar */}
          <div className="space-y-4">
            {/* Quick action buttons */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 sticky top-24">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Interested? Contact Us</p>
              <div className="flex flex-col gap-3 mb-5">
                <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-charcoal-950 text-white font-semibold py-3 rounded-lg hover:bg-charcoal-800 transition-colors text-sm">
                  <Phone className="w-4 h-4" /> Call Agent
                </a>
                <a
                  href={`https://wa.me/+918872520002?text=${encodeURIComponent(`Hi! I'm interested in: ${property.title}\nLocation: ${property.city}\nPrice: ${price}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              {/* Inquiry form */}
              <InquiryForm propertyId={property.id} propertyTitle={property.title} />

              {/* Trust signals */}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                {[
                  { icon: Shield, text: 'Zero Brokerage Properties Available' },
                  { icon: CheckCircle, text: 'RERA Verified Listings' },
                  { icon: Shield, text: '100% Secure Transaction' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-gray-500 text-xs">
                    <Icon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
