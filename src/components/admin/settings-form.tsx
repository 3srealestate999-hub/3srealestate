'use client'

import { useState } from 'react'
import { Loader2, Save, CheckCircle2 } from 'lucide-react'

interface Props {
  initialSettings: Record<string, string>
}

const settingFields = [
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+918872520002', group: 'Contact' },
  { key: 'phone_primary', label: 'Primary Phone', placeholder: '+91-88725-20002', group: 'Contact' },
  { key: 'phone_secondary', label: 'Secondary Phone', placeholder: '+91-88725-20002', group: 'Contact' },
  { key: 'email_primary', label: 'Primary Email', placeholder: 'info@3srealestate.com', group: 'Contact' },
  { key: 'address', label: 'Office Address', placeholder: 'SCO 123, Sector 17-C, Chandigarh', group: 'Contact' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...', group: 'Social' },
  { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...', group: 'Social' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...', group: 'Social' },
]

const groups = Array.from(new Set(settingFields.map((f) => f.group)))

export function AdminSettingsForm({ initialSettings }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-charcoal-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-500 transition-colors'
  const labelCls = 'block text-white/60 text-xs mb-1.5 font-medium'

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group} className="bg-charcoal-900 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">{group}</h2>
          {settingFields.filter((f) => f.group === group).map((field) => (
            <div key={field.key}>
              <label className={labelCls}>{field.label}</label>
              <input
                value={values[field.key] || ''}
                onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-gold-gradient text-white font-semibold px-6 py-3 rounded-lg shadow-gold hover:shadow-gold-lg transition-all disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
