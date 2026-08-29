'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Eye, Trash2, Loader2 } from 'lucide-react'

interface Property {
  id: string
  title: string
  slug: string
  city: string
  locality: string
  price: number
  priceLabel?: string | null
  coverImage: string
  status: string
  isFeatured: boolean
  isLuxury: boolean
  _count: { inquiries: number }
}

function formatPriceINR(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} Lac`
  return `₹${price.toLocaleString('en-IN')}`
}

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-500/10 text-green-400',
  SOLD: 'bg-red-500/10 text-red-400',
  UNDER_NEGOTIATION: 'bg-orange-500/10 text-orange-400',
  COMING_SOON: 'bg-blue-500/10 text-blue-400',
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchProperties = async (status?: string) => {
    setLoading(true)
    try {
      const url = `/api/admin/properties${status ? `?status=${status}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) {
        setProperties(data.properties)
        setTotal(data.total)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(statusFilter)
  }, [statusFilter])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id))
        setTotal((prev) => prev - 1)
      } else {
        alert('Failed to delete property')
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Properties</h1>
          <p className="text-white/40 text-sm mt-1">{total} listings</p>
        </div>
        <Link href="/admin/properties/new"
          className="flex items-center gap-2 bg-gold-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-gold hover:shadow-gold-lg transition-all">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 bg-charcoal-900 border border-white/10 rounded-xl p-3">
        {['', 'AVAILABLE', 'SOLD', 'UNDER_NEGOTIATION', 'COMING_SOON'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          No properties found.{' '}
          <Link href="/admin/properties/new" className="text-gold-400 hover:text-gold-300">Add one →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <div key={p.id} className="bg-charcoal-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
              <div className="relative h-40">
                <Image src={p.coverImage} alt={p.title} fill className="object-cover" sizes="400px" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {p.isFeatured && <span className="bg-gold-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded-full">FEATURED</span>}
                  {p.isLuxury && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">LUXURY</span>}
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
                  <p className="text-gold-400 font-bold text-sm">{p.priceLabel || formatPriceINR(p.price)}</p>
                  <p className="text-white/30 text-xs">{p._count.inquiries} inquiries</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/property/${p.slug}`} target="_blank"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <Link href={`/admin/properties/${p.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 rounded-lg text-xs transition-colors">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={deletingId === p.id}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors disabled:opacity-50"
                  >
                    {deletingId === p.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}