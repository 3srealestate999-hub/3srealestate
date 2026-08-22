'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImagePlus, GripVertical } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

interface MultiImageUploaderProps {
  values: string[]
  onChange: (urls: string[]) => void
  max?: number
  label?: string
}

// Single image uploader (existing)
export function ImageUploader({ value, onChange, label = 'Cover Image' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files allowed'); return }
    if (file.size > 10 * 1024 * 1024) { setError('File must be under 10MB'); return }
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.url) { onChange(data.url) }
      else { setError(data.error || 'Upload failed') }
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div>
      <label className="block text-white/60 text-xs mb-1.5 font-medium uppercase tracking-wide">{label}</label>
      {value && !uploading && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 border border-white/10 group">
          <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-white text-charcoal-900 text-xs font-semibold px-4 py-2 rounded-lg">
              <Upload className="w-3.5 h-3.5" /> Change
            </button>
            <button type="button" onClick={() => onChange('')}
              className="flex items-center gap-2 bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-lg">
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      )}
      {(!value || uploading) && (
        <div onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${uploading ? 'border-gold-500/50 bg-gold-500/5 cursor-wait' : 'border-white/20 hover:border-gold-500 hover:bg-white/5 cursor-pointer'}`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-9 h-9 text-gold-400 animate-spin" />
              <p className="text-white/60 text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <ImagePlus className="w-8 h-8 text-white/30" />
              <p className="text-white/60 text-sm">Click to upload or drag & drop</p>
              <p className="text-white/30 text-xs">PNG, JPG, WEBP — max 10MB</p>
            </div>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} className="hidden" />
      <div className="mt-3">
        <p className="text-white/30 text-xs mb-1.5">Or paste an image URL:</p>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com/image.jpg"
          className="w-full bg-charcoal-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-500 transition-colors" />
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  )
}

// Multi image uploader (new)
export function MultiImageUploader({ values, onChange, max = 10, label = 'Property Images' }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    const remaining = max - values.length
    if (remaining <= 0) { setError(`Maximum ${max} images allowed`); return }

    const filesToUpload = Array.from(files).slice(0, remaining)
    setError('')
    setUploading(true)

    const uploaded: string[] = []
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) continue
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (res.ok && data.url) uploaded.push(data.url)
      } catch {}
    }

    onChange([...values, ...uploaded])
    setUploading(false)
  }

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const moveImage = (from: number, to: number) => {
    const newValues = [...values]
    const [moved] = newValues.splice(from, 1)
    newValues.splice(to, 0, moved)
    onChange(newValues)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-white/60 text-xs font-medium uppercase tracking-wide">{label}</label>
        <span className="text-white/30 text-xs">{values.length}/{max} images</span>
      </div>

      {/* Image grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {values.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
              <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" unoptimized />

              {/* Index badge */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>

              {/* Cover badge */}
              {i === 0 && (
                <div className="absolute bottom-2 left-2 bg-gold-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Cover
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button type="button" onClick={() => moveImage(i, i - 1)}
                    className="w-7 h-7 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                    title="Move left">
                    ←
                  </button>
                )}
                <button type="button" onClick={() => removeImage(i)}
                  className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {i < values.length - 1 && (
                  <button type="button" onClick={() => moveImage(i, i + 1)}
                    className="w-7 h-7 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                    title="Move right">
                    →
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {values.length < max && (
            <div onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-gold-500 hover:bg-white/5 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="w-6 h-6 text-white/30" />
                  <span className="text-white/30 text-xs">Add More</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Initial upload area */}
      {values.length === 0 && (
        <div onClick={() => inputRef.current?.click()}
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${uploading ? 'border-gold-500/50 bg-gold-500/5 cursor-wait' : 'border-white/20 hover:border-gold-500 hover:bg-white/5 cursor-pointer'}`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-9 h-9 text-gold-400 animate-spin" />
              <p className="text-white/60 text-sm">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <ImagePlus className="w-10 h-10 text-white/30" />
              <div>
                <p className="text-white/70 text-sm font-medium">Click to upload images</p>
                <p className="text-white/30 text-xs mt-1">Select up to {max} images • PNG, JPG, WEBP • max 10MB each</p>
              </div>
              <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-lg px-4 py-2">
                <Upload className="w-4 h-4 text-gold-400" />
                <span className="text-gold-400 text-xs font-medium">📱 Phone gallery or 💻 Computer files</span>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = '' }}
        className="hidden"
      />

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      <p className="text-white/20 text-xs mt-2">First image will be used as the cover photo. Use arrows to reorder.</p>
    </div>
  )
}