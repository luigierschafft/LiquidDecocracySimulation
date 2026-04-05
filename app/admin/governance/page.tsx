import { getAppSetting, setAppSetting } from '@/lib/data/settings'
import { revalidatePath } from 'next/cache'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminGovernancePage() {
  const rules = await getAppSetting('governance_rules') ?? ''

  async function saveRules(formData: FormData) {
    'use server'
    const value = formData.get('rules') as string
    await setAppSetting('governance_rules', value ?? '')
    revalidatePath('/admin/governance')
    revalidatePath('/governance')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-accent" />
          Governance Rules
        </h1>
        <p className="text-foreground/60 mt-1">Define the platform&apos;s governance rules. Markdown supported.</p>
      </div>

      <form action={saveRules} className="card space-y-4">
        <textarea
          name="rules"
          defaultValue={rules}
          rows={20}
          className="input w-full text-sm font-mono resize-y"
          placeholder="# Governance Rules&#10;&#10;Write your platform rules in Markdown..."
        />
        <div className="flex justify-between items-center">
          <a href="/governance" target="_blank" className="text-sm text-accent hover:underline">
            Preview public page →
          </a>
          <button type="submit" className="btn-primary">Save Rules</button>
        </div>
      </form>
    </div>
  )
}
