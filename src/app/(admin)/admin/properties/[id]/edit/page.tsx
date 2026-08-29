'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, PropertyInput } from '@/lib/validations'
import { Loader2, ArrowLeft } from 'lucide-react'
import { ImageUploader, MultiImageUploader } from '@/components/admin/image-uploader'

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
  })

  // Fetch existing property
  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/admin/properties/${params.id}`)
        const data = await res.json()
        if (res.ok && data.property) {
          const p = data.property
          reset({
            title: p.title,
            description: p.description,
            type: p.type,
            purpose: p.purpose,
            status: p.status,
            price: p.price,
            priceLabel: p.priceLabel || '',
            area: p.area,
            areaUnit: p.areaUnit,
            bedrooms: p.bedrooms || undefined,
            bathrooms: p.bathrooms || undefined,
            parking: p.parking || undefined,
            furnishing: p.furnishing || undefined,
            possession: p.possession || undefined,
            investmentReturn: p.investmentReturn || undefined,
            city: p.city,
            locality: p.locality,
            address: p.address,
            builderName: p.builderName || '',
            coverImage: p.coverImage,
            isFeatured: p.isFeatured,
            isLuxury: p.isLuxury,
            metaTitle: p.metaTitle || '',
            metaDescription: p.metaDescription || '',
          })
          setCoverImageUrl(p.coverImage)
          setAdditionalImages(p.images?.map((img: any) => img.url) || [])
          setAmenities(p.amenities?.map((a: any) => a.name) || [])
        }
      } catch (e) {
        setError('Failed to load property')
      } finally {
        setFetching(false)
      }
    }
    fetchProperty()
  }, [params.id, reset])

  const onSubmit = async (data: PropertyInput) => {
    if (!coverImageUrl) { setError('Please upload a cover image'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/properties/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          coverImage: coverImageUrl,
          amenities: amenities.map((name) => ({ name })),
          images: additionalImages.map((url, i) => ({ url, order: i, isPrimary: false })),
        }),
      })
      const json = await res.json()
      if (res.ok) {
        router.push('/admin/properties')
      } else {
        setError(json.error || 'Failed to update property')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-charcoal-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-500 transition-colors'
  const labelCls = 'block text-white/60 text-xs mb-1.5 font-medium uppercase tracking-wide'

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Edit Property</h1>
          <p className="text-white/40 text-sm">Update property details</p>
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
            <input {...register('title')} className={inputCls} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Description *</label>
            <textarea {...register('description')} rows={5} className={`${inputCls} resize-none`} />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Property Type *</label>
              <select {...register('type')} className={inputCls}>
                {['FLAT','VILLA','PLOT','COMMERCIAL','LUXURY','RENTAL','AGRICULTURAL','RESIDENTIAL'].map((t) => (
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
              <input {...register('price', { valueAsNumber: true })} type="number" className={inputCls} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Price Label</label>
              <input {...register('priceLabel')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Area *</label>
              <input {...register('area', { valueAsNumber: true })} type="number" className={inputCls} />
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
              <input {...register('bedrooms', { valueAsNumber: true })} type="number" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <input {...register('bathrooms', { valueAsNumber: true })} type="number" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Parking</label>
              <input {...register('parking', { valueAsNumber: true })} type="number" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Investment Return %</label>
              <input {...register('investmentReturn', { valueAsNumber: true })} type="number" step="0.1" className={inputCls} />
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
              <input {...register('city')} className={inputCls} />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Locality *</label>
              <input {...register('locality')} className={inputCls} />
              {errors.locality && <p className="text-red-400 text-xs mt-1">{errors.locality.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Full Address *</label>
            <input {...register('address')} className={inputCls} />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Builder Name</label>
            <input {...register('builderName')} className={inputCls} />
          </div>
        </section>

        {/* Media */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-6">
          <h2 className="text-white font-semibold">Property Images</h2>
          <ImageUploader
            value={coverImageUrl}
            onChange={(url) => { setCoverImageUrl(url); setValue('coverImage', url) }}
            label="Cover Image *"
          />
          <div className="pt-4 border-t border-white/10">
            <MultiImageUploader
              values={additionalImages}
              onChange={setAdditionalImages}
              max={10}
              label="Additional Images (up to 10)"
            />
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Amenities</h2>
          <div className="flex flex-wrap gap-4">
            {['Swimming Pool','Gym','24/7 Security','Club House','Power Backup','Parking','Lift','Garden','Children Play Area','CCTV','Intercom','Rainwater Harvesting'].map((a) => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={amenities.includes(a)}
                  onChange={(e) => setAmenities(e.target.checked ? [...amenities, a] : amenities.filter((x) => x !== a))}
                  className="accent-gold-500 w-4 h-4" />
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
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-lg text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-gold-gradient text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}