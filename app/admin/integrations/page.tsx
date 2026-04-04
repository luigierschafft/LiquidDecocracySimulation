import { BookOpen, Webhook, Upload } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminIntegrationsPage() {
  const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/webhooks/topics`

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Webhook className="w-7 h-7 text-accent" />
          External Integrations
        </h1>
        <p className="text-foreground/60 mt-1">Import topics and connect external systems</p>
      </div>

      {/* Webhook */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Webhook className="w-5 h-5 text-accent" />
          Topic Webhook
        </h2>
        <p className="text-sm text-foreground/60">
          POST to this endpoint to create a topic from an external system. Include your <code className="bg-sand px-1 rounded">CRON_SECRET</code> as a Bearer token.
        </p>
        <div className="bg-sand rounded-lg px-3 py-2 font-mono text-sm break-all">{webhookUrl}</div>
        <div className="text-xs text-foreground/50 space-y-1">
          <p className="font-semibold">Request body (JSON):</p>
          <pre className="bg-sand rounded p-2 overflow-x-auto">{`{
  "title": "Topic title",
  "content": "Topic description",
  "area_id": "<uuid>"  // optional
}`}</pre>
        </div>
      </div>

      {/* CSV Import info */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Upload className="w-5 h-5 text-accent" />
          CSV Import
        </h2>
        <p className="text-sm text-foreground/60">
          Bulk-import topics via CSV. Use the Supabase dashboard to import directly into the <code className="bg-sand px-1 rounded">issue</code> table.
        </p>
        <div className="text-xs text-foreground/50 space-y-1">
          <p className="font-semibold">Required CSV columns:</p>
          <pre className="bg-sand rounded p-2">title, content, area_id, author_id, status</pre>
        </div>
      </div>
    </div>
  )
}
