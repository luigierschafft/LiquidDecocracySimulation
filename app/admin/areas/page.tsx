import { createClient } from '@/lib/supabase/server'
import { CrudTable } from '@/components/admin/CrudTable'

export const dynamic = 'force-dynamic'

export default async function AdminAreasPage() {
  const supabase = createClient()
  const [{ data: areas }, { data: units }] = await Promise.all([
    supabase.from('area').select('*, unit(name)').order('name'),
    supabase.from('unit').select('id, name').order('name'),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Areas</h1>
      <CrudTable
        table="area"
        items={areas ?? []}
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
        displayField={(item) => `${item.unit?.name ?? ''} › ${item.name}`}
      />
    </div>
  )
}
