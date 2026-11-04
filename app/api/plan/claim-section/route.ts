import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

async function sectionRequest(req: Request) {
  const session = await requireUser()
  const { section_id } = await readJson<{ section_id?: string }>(req)
  if (!section_id) throw badRequest('section_id required')
  return { ...session, section_id }
}

/** Claim ownership of a plan section. */
export const POST = apiRoute(async (req) => {
  const { supabase, user, section_id } = await sectionRequest(req)
  const { error } = await supabase.from('ev_section_owners').insert({ section_id, user_id: user.id })
  if (error) throw error
  return { ok: true }
})

/** Release ownership of a plan section. */
export const DELETE = apiRoute(async (req) => {
  const { supabase, user, section_id } = await sectionRequest(req)
  const { error } = await supabase
    .from('ev_section_owners')
    .delete()
    .eq('section_id', section_id)
    .eq('user_id', user.id)
  if (error) throw error
  return { ok: true }
})
