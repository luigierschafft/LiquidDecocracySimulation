import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UnitsPage() {
  const supabase = createClient()
  const { data: units } = await supabase
    .from('unit')
    .select('*, areas:area(id, name)')
    .order('name')

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Governance Areas</h1>
        <p className="text-foreground/60 mt-1">Browse proposals by topic area</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {units?.map((unit: any) => (
          <div key={unit.id} className="card space-y-3">
            <h2 className="font-semibold text-lg">{unit.name}</h2>
            {unit.description && <p className="text-sm text-foreground/60">{unit.description}</p>}
            {unit.areas?.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-sand">
                {unit.areas.map((area: any) => (
                  <Link
                    key={area.id}
                    href={`/units/${unit.id}/${area.id}`}
                    className="flex items-center justify-between text-sm py-1 text-foreground/70 hover:text-accent hover:pl-1 transition-all"
                  >
                    {area.name}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
