import { createClient } from '@/lib/supabase/server'
import { CrudTable } from '@/components/admin/CrudTable'

export default async function AdminUnitsPage() {
  const supabase = createClient()
  const { data: units } = await supabase.from('unit').select('*').order('name')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Units</h1>
      <CrudTable
        table="unit"
        items={units ?? []}
        fields={[
          { key: 'name', label: 'Name', required: true },
          { key: 'description', label: 'Description' },
        ]}
      />
    </div>
  )
}
