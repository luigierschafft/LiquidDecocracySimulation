import { createClient } from '@/lib/supabase/server'
import { CrudTable } from '@/components/admin/CrudTable'

export const dynamic = 'force-dynamic'

export default async function AdminAreasPage() {
  const supabase = createClient()
  const [{ data: areas }, { data: units }] = await Promise.all([
    supabase.from('area').select('*, unit(name)').order('name'),
    supabase.from('unit').select('id, name').order('name'),
  ])

  const enrichedAreas = (areas ?? []).map((a: any) => ({
    ...a,
    _label: `${a.unit?.name ?? ''} › ${a.name}`,
  }))

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Areas</h1>
      <CrudTable
        table="area"
        items={enrichedAreas}
        fields={[
          { key: 'name', label: 'Name', required: true },
          { key: 'description', label: 'Description' },
          {
            key: 'unit_id',
            label: 'Unit',
            required: true,
            type: 'select',
            options: (units ?? []).map((u: any) => ({ value: u.id, label: u.name })),
          },
        ]}
        displayKey="_label"
      />
    </div>
  )
}
