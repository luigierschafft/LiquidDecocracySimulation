import { createClient } from '@/lib/supabase/server'
import { CrudTable } from '@/components/admin/CrudTable'

export const dynamic = 'force-dynamic'

export default async function AdminAreasPage() {
  const supabase = createClient()
  const { data: areas } = await supabase.from('area').select('*').order('name')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Areas</h1>
      <CrudTable
        table="area"
        items={areas ?? []}
        fields={[
          { key: 'name', label: 'Name', required: true },
          { key: 'description', label: 'Description' },
        ]}
      />
    </div>
  )
}
