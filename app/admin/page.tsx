import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, MapPin, Settings } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createClient()
  const [
    { count: memberCount },
    { count: pendingCount },
    { count: issueCount },
    { count: unitCount },
  ] = await Promise.all([
    supabase.from('member').select('*', { count: 'exact', head: true }),
    supabase.from('member').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    supabase.from('issue').select('*', { count: 'exact', head: true }),
    supabase.from('unit').select('*', { count: 'exact', head: true }),
  ])

  const adminLinks = [
    { href: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users', desc: 'Approve members, set admin roles' },
    { href: '/admin/units', icon: <MapPin className="w-5 h-5" />, label: 'Units', desc: 'Manage governance units' },
    { href: '/admin/areas', icon: <MapPin className="w-5 h-5" />, label: 'Areas', desc: 'Manage sub-areas per unit' },
    { href: '/admin/policies', icon: <Settings className="w-5 h-5" />, label: 'Policies', desc: 'Configure lifecycle timings' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-foreground/60 mt-1">Manage the Liquid Democracy platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: memberCount ?? 0 },
          { label: 'Pending Approval', value: pendingCount ?? 0, urgent: (pendingCount ?? 0) > 0 },
          { label: 'Total Issues', value: issueCount ?? 0 },
          { label: 'Units', value: unitCount ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className={`card text-center ${stat.urgent ? 'border-accent/50 bg-accent/5' : ''}`}>
            <div className={`text-2xl font-bold ${stat.urgent ? 'text-accent' : 'text-foreground'}`}>{stat.value}</div>
            <div className="text-xs text-foreground/60 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="card flex items-center gap-4 hover:shadow-md hover:border-accent/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                {link.icon}
              </div>
              <div>
                <p className="font-medium">{link.label}</p>
                <p className="text-sm text-foreground/50">{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
