'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, PropertyInput } from '@/lib/validations'
import { Loader2, ArrowLeft } from 'lucide-react'
import { ImageUploader } from '@/components/admin/image-uploader'

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [amenities, setAmenities] = useState<string[]>([
    'Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Power Backup',
  ])

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'AVAILABLE',
      areaUnit: 'sqft',
      isFeatured: false,
      isLuxury: false,
    },
  })

  const onSubmit = async (data: PropertyInput) => {
    if (!coverImageUrl) {
      setError('Please upload a cover image')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          coverImage: coverImageUrl,
          amenities: amenities.map((name) => ({ name })),
        }),
      })
      const json = await res.json()
      if (res.ok) {
        router.push('/admin/properties')
      } else {
        setError(json.error || 'Failed to create property')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-charcoal-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-500 transition-colors'
  const labelCls = 'block text-white/60 text-xs mb-1.5 font-medium uppercase tracking-wide'

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Add New Property</h1>
          <p className="text-white/40 text-sm">Fill in all required fields</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Info */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Basic Information</h2>
          <div>
            <label className={labelCls}>Title *</label>
            <input {...register('title')} placeholder="e.g. Luxury 3BHK Flat in Mohali Sector 70" className={inputCls} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Description *</label>
            <textarea {...register('description')} rows={5} placeholder="Detailed property description..." className={`${inputCls} resize-none`} />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Property Type *</label>
              <select {...register('type')} className={inputCls}>
                {['FLAT', 'VILLA', 'PLOT', 'COMMERCIAL', 'LUXURY', 'RENTAL', 'AGRICULTURAL', 'RESIDENTIAL'].map((t) => (
                  <option key={t} value={t} className="bg-charcoal-800">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Purpose *</label>
              <select {...register('purpose')} className={inputCls}>
                <option value="SALE" className="bg-charcoal-800">For Sale</option>
                <option value="RENT" className="bg-charcoal-800">For Rent</option>
                <option value="INVESTMENT" className="bg-charcoal-800">Investment</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select {...register('status')} className={inputCls}>
                <option value="AVAILABLE" className="bg-charcoal-800">Available</option>
                <option value="SOLD" className="bg-charcoal-800">Sold</option>
                <option value="UNDER_NEGOTIATION" className="bg-charcoal-800">Under Negotiation</option>
                <option value="COMING_SOON" className="bg-charcoal-800">Coming Soon</option>
              </select>
            </div>
          </div>
        </section>

        {/* Pricing & Area */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Pricing & Area</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input {...register('price', { valueAsNumber: true })} type="number" placeholder="e.g. 8500000" className={inputCls} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Price Label</label>
              <input {...register('priceLabel')} placeholder="e.g. 85 Lac" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Area *</label>
              <input {...register('area', { valueAsNumber: true })} type="number" placeholder="e.g. 1650" className={inputCls} />
              {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Area Unit</label>
              <select {...register('areaUnit')} className={inputCls}>
                <option value="sqft" className="bg-charcoal-800">sq ft</option>
                <option value="sqyd" className="bg-charcoal-800">sq yd</option>
                <option value="sqm" className="bg-charcoal-800">sq m</option>
                <option value="acre" className="bg-charcoal-800">acre</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Bedrooms</label>
              <input {...register('bedrooms', { valueAsNumber: true })} type="number" placeholder="3" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <input {...register('bathrooms', { valueAsNumber: true })} type="number" placeholder="3" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Parking</label>
              <input {...register('parking', { valueAsNumber: true })} type="number" placeholder="2" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Investment Return %</label>
              <input {...register('investmentReturn', { valueAsNumber: true })} type="number" step="0.1" placeholder="12.5" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Furnishing</label>
              <select {...register('furnishing')} className={inputCls}>
                <option value="" className="bg-charcoal-800">Select</option>
                <option value="UNFURNISHED" className="bg-charcoal-800">Unfurnished</option>
                <option value="SEMI_FURNISHED" className="bg-charcoal-800">Semi Furnished</option>
                <option value="FULLY_FURNISHED" className="bg-charcoal-800">Fully Furnished</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Possession</label>
              <select {...register('possession')} className={inputCls}>
                <option value="" className="bg-charcoal-800">Select</option>
                <option value="READY_TO_MOVE" className="bg-charcoal-800">Ready to Move</option>
                <option value="UNDER_CONSTRUCTION" className="bg-charcoal-800">Under Construction</option>
                <option value="NEW_LAUNCH" className="bg-charcoal-800">New Launch</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City *</label>
              <input {...register('city')} placeholder="Mohali" className={inputCls} />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Locality *</label>
              <input {...register('locality')} placeholder="Sector 70" className={inputCls} />
              {errors.locality && <p className="text-red-400 text-xs mt-1">{errors.locality.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Full Address *</label>
            <input {...register('address')} placeholder="Full address with pincode" className={inputCls} />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Builder Name</label>
            <input {...register('builderName')} placeholder="DLF, Emaar, Godrej..." className={inputCls} />
          </div>
        </section>

        {/* Media — File Upload */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Property Images</h2>
          <ImageUploader
            value={coverImageUrl}
            onChange={(url) => {
              setCoverImageUrl(url)
              setValue('coverImage', url)
            }}
            label="Cover Image *"
          />
          {!coverImageUrl && errors.coverImage && (
            <p className="text-red-400 text-xs">{errors.coverImage.message}</p>
          )}
        </section>

        {/* Amenities */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Amenities</h2>
          <div className="flex flex-wrap gap-4">
            {[
              'Swimming Pool', 'Gym', '24/7 Security', 'Club House',
              'Power Backup', 'Parking', 'Lift', 'Garden',
              'Children Play Area', 'CCTV', 'Intercom', 'Rainwater Harvesting',
            ].map((a) => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.includes(a)}
                  onChange={(e) =>
                    setAmenities(
                      e.target.checked ? [...amenities, a] : amenities.filter((x) => x !== a)
                    )
                  }
                  className="accent-gold-500 w-4 h-4"
                />
                <span className="text-white/70 text-sm">{a}</span>
              </label>
            ))}
          </div>
        </section>

        {/* SEO & Flags */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">SEO & Flags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Meta Title</label>
              <input {...register('metaTitle')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <input {...register('metaDescription')} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 accent-gold-500" />
              <span className="text-white/70 text-sm">Featured Property</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('isLuxury')} type="checkbox" className="w-4 h-4 accent-gold-500" />
              <span className="text-white/70 text-sm">Luxury Property</span>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gold-gradient text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-gold-lg transition-all"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating Property...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  )
}