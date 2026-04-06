'use client'

// Module 95: Auto Translation — language preference selector (stub)
import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Languages } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी' },
]

interface Props {
  memberId: string
  currentLang?: string | null
}

export function LanguageSelector({ memberId, currentLang }: Props) {
  const [selected, setSelected] = useState(currentLang ?? 'en')
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function save() {
    await supabase
      .from('member')
      .update({ preferred_language: selected } as any)
      .eq('id', memberId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card space-y-4">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <Languages className="w-5 h-5 text-accent" />
        Language Preference
      </h2>
      <p className="text-sm text-foreground/60">
        Choose your preferred language. Auto-translation is coming soon — currently English content is shown to all members.
      </p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setSelected(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              selected === lang.code
                ? 'bg-accent text-white border-accent'
                : 'bg-sand border-sand text-foreground/70 hover:border-accent/40'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <button
        onClick={save}
        className="btn-primary text-sm py-1.5 px-4"
      >
        {saved ? 'Saved ✓' : 'Save preference'}
      </button>
    </div>
  )
}
