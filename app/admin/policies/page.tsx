import { createClient } from '@/lib/supabase/server'
import { CrudTable } from '@/components/admin/CrudTable'

export const dynamic = 'force-dynamic'

export default async function AdminPoliciesPage() {
  const supabase = createClient()
  const { data: policies } = await supabase.from('policy').select('*').order('name')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Policies</h1>
      <p className="text-foreground/60">Configure lifecycle timing for issues.</p>
      <CrudTable
        table="policy"
        items={policies ?? []}
        fields={[
          { key: 'name', label: 'Policy Name', required: true },
          { key: 'admission_days', label: 'Admission Days', type: 'number', required: true },
          { key: 'discussion_days', label: 'Discussion Days', type: 'number', required: true },
          { key: 'verification_days', label: 'Verification Days', type: 'number', required: true },
          { key: 'voting_days', label: 'Voting Days', type: 'number', required: true },
          { key: 'quorum', label: 'Quorum', type: 'number', required: true },
        ]}
      />
    </div>
  )
}
