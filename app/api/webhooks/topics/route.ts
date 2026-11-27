import { apiRoute, badRequest, HttpError, readJson, requireCronSecret } from '@/lib/api/handler'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { getCurrentPlatformId } from '@/lib/platform'

// Module 96: External Integration — create topics via webhook
// Auth: `Authorization: Bearer $CRON_SECRET`
export const POST = apiRoute(async (req) => {
  requireCronSecret(req)
  const body = await readJson<{ title?: string; content?: string; area_id?: string; platform_id?: string }>(req)
  if (!body.title?.trim() || !body.content?.trim()) throw badRequest('title and content are required')

  // No user session here — use the service-role client
  const supabase = createAdminClient()

  // Use first admin as author
  const { data: admin } = await supabase.from('member').select('id').eq('is_admin', true).limit(1).single()
  if (!admin) throw new HttpError(500, 'No admin found')

  const { data: issue, error } = await supabase
    .from('issue')
    .insert({
      title: body.title.trim(),
      description: body.content.trim(),
      area_id: body.area_id ?? null,
      platform_id: body.platform_id ?? (await getCurrentPlatformId()),
      author_id: admin.id,
      status: 'admission',
    })
    .select('id')
    .single()
  if (error) throw error

  return NextResponse.json({ id: issue.id }, { status: 201 })
})
