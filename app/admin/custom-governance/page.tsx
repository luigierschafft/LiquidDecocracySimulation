import { createClient } from '@/lib/supabase/server'
import { getEffectiveModules } from '@/lib/modules'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Sliders } from 'lucide-react'

// Module 67: Custom Governance — per-policy quick override UI
export const dynamic = 'force-dynamic'

export default async function CustomGovernancePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [modules, memberResult, { data: policies }] = await Promise.all([
    getEffectiveModules(user.id),
    supabase.from('member').select('is_admin').eq('id', user.id).single(),
    supabase.from('policy').select('*').order('name'),
  ])

  if (!modules.custom_governance || !memberResult.data?.is_admin) notFound()

  async function updatePolicy(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const supabaseInner = createClient()
    const voting_method = formData.get('voting_method') as string
    await supabaseInner.from('policy').update({
      admission_days: Number(formData.get('admission_days')),
      discussion_days: Number(formData.get('discussion_days')),
      verification_days: Number(formData.get('verification_days')),
      voting_days: Number(formData.get('voting_days')),
      quorum: Number(formData.get('quorum')),
      consensus_threshold: Number(formData.get('consensus_threshold')),
      voting_method: ['approval', 'schulze'].includes(voting_method) ? voting_method : 'approval',
    }).eq('id', id)
    revalidatePath('/admin/custom-governance')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sliders className="w-7 h-7 text-accent" />
          Custom Governance
        </h1>
        <p className="text-foreground/60 mt-1">Override phase timings, quorum, and consensus thresholds per policy.</p>
      </div>

      <div className="space-y-6">
        {(policies ?? []).map((policy) => (
          <form key={policy.id} action={updatePolicy} className="card space-y-4">
            <input type="hidden" name="id" value={policy.id} />
            <div>
              <h2 className="font-semibold text-lg">{policy.name}</h2>
              {(policy as any).description && (
                <p className="text-sm text-foreground/50 mt-0.5 leading-snug">{(policy as any).description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: 'admission_days', label: 'Admission (days)', value: policy.admission_days },
                { name: 'discussion_days', label: 'Discussion (days)', value: policy.discussion_days },
                { name: 'verification_days', label: 'Verification (days)', value: policy.verification_days },
                { name: 'voting_days', label: 'Voting (days)', value: policy.voting_days },
                { name: 'quorum', label: 'Quorum (votes)', value: policy.quorum },
                { name: 'consensus_threshold', label: 'Consensus % (0-1)', value: policy.consensus_threshold },
              ].map((f) => (
                <div key={f.name} className="space-y-1">
                  <label className="text-xs font-medium text-foreground/60">{f.label}</label>
                  <input
                    type="number"
                    name={f.name}
                    defaultValue={f.value}
                    step={f.name === 'consensus_threshold' ? '0.01' : '1'}
                    min="0"
                    className="input w-full text-sm py-1.5"
                  />
                </div>
              ))}
            </div>

            {/* M27: Voting method */}
            <div className="space-y-1 border-t border-sand pt-4">
              <label className="text-xs font-medium text-foreground/60">Voting Method</label>
              <select
                name="voting_method"
                defaultValue={(policy as any).voting_method ?? 'approval'}
                className="input w-full text-sm py-1.5"
              >
                <option value="approval">Approval Voting (Yes / No / Abstain)</option>
                <option value="schulze">Ranked Choice — Schulze Method</option>
              </select>
              <div className="space-y-1 mt-1">
                <p className="text-[11px] text-foreground/40">
                  <span className="font-medium text-foreground/60">Approval Voting:</span> Each voter casts Yes/No/Abstain on every proposal independently. The proposal with the most approvals wins when quorum is met.
                </p>
                <p className="text-[11px] text-foreground/40">
                  <span className="font-medium text-foreground/60">Ranked Choice (Schulze):</span> Voters rank proposals by preference. The Schulze method finds the Condorcet winner — the option that beats all others in head-to-head comparisons. Requires the Ranking Voting module.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary text-sm py-1.5 px-4">Save {policy.name}</button>
            </div>
          </form>
        ))}

        {(policies ?? []).length === 0 && (
          <div className="card text-center py-10 text-foreground/40 text-sm">
            No policies found. Create policies in the <a href="/admin/policies" className="text-accent hover:underline">Policies</a> page first.
          </div>
        )}
      </div>
    </div>
  )
}
