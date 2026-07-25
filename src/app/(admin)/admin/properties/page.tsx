import { prisma } from '@/lib/prisma'
import { formatPriceINR, formatDateShort } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Eye } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Properties | 3S Admin' }

interface PageProps { searchParams: { status?: string; page?: string } }

async function getProperties(params: PageProps['searchParams']) {
  const page = parseInt(params.page || '1')
  const limit = 15
  const where: any = {}
  if (params.status) where.status = params.status
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where, orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit, take: limit,
      include: { _count: { select: { inquiries: true } } },
    }),
    prisma.property.count({ where }),
  ])
  return { properties, total, page, pages: Math.ceil(total / limit) }
}

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-500/10 text-green-400',
  SOLD: 'bg-red-500/10 text-red-400',
  UNDER_NEGOTIATION: 'bg-orange-500/10 text-orange-400',
  COMING_SOON: 'bg-blue-500/10 text-blue-400',
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const { properties, total, page, pages } = await getProperties(searchParams)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Properties</h1>
          <p className="text-white/40 text-sm mt-1">{total} listings</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-gold-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-gold hover:shadow-gold-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 bg-charcoal-900 border border-white/10 rounded-xl p-3">
        {['', 'AVAILABLE', 'SOLD', 'UNDER_NEGOTIATION', 'COMING_SOON'].map((s) => (
          <Link
            key={s}
            href={`/admin/properties${s ? `?status=${s}` : ''}`}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              (searchParams.status === s) || (!searchParams.status && !s)
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {s || 'All'}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-white/30">
            No properties found. <Link href="/admin/properties/new" className="text-gold-400 hover:text-gold-300">Add one →</Link>
          </div>
        ) : (
          properties.map((p) => (
            <div key={p.id} className="bg-charcoal-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
              <div className="relative h-40">
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="400px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {p.isFeatured && (
                    <span className="bg-gold-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      FEATURED
                    </span>
                  )}
                  {p.isLuxury && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      LUXURY
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[p.status] || 'bg-gray-500/10 text-gray-400'}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{p.title}</h3>
                <p className="text-white/40 text-xs mb-2">{p.locality}, {p.city}</p>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gold-400 font-bold text-sm">
                    {p.priceLabel || formatPriceINR(p.price)}
                  </p>
                  <p className="text-white/30 text-xs">{p._count.inquiries} inquiries</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/property/${p.slug}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <Link
                    href={`/admin/properties/${p.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 rounded-lg text-xs transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/properties?page=${p}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium ${
                p === page
                  ? 'bg-gold-gradient text-white'
                  : 'bg-charcoal-900 text-white/50 hover:text-white border border-white/10'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}