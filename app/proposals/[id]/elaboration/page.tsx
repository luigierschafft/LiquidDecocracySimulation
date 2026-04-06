import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Elaboration, ElaborationSection, ElaborationComment, ElaborationEditor, Member } from '@/lib/types'
import { SectionEditor } from '@/components/elaboration/SectionEditor'
import { ManageEditors } from '@/components/elaboration/ManageEditors'
import { getMemberDisplayName } from '@/lib/utils'
import { ArrowLeft, Plus, FileEdit } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const DEFAULT_SECTIONS = ['Overview', 'Budget', 'Timeline', 'Legal & Permissions', 'Resources', 'Next Steps']

interface Props {
  params: { id: string }
}

export default async function ElaborationPage({ params }: Props) {
  const supabase = createClient()

  const [{ data: issue }, { data: { user } }] = await Promise.all([
    supabase
      .from('issue')
      .select('id, title, status, accepted_initiative_id, initiatives:initiative!initiative_issue_id_fkey(id, title)')
      .eq('id', params.id)
      .single(),
    supabase.auth.getUser(),
  ])

  if (!issue) notFound()
  if (issue.status !== 'closed' || !issue.accepted_initiative_id) {
    redirect(`/proposals/${params.id}`)
  }

  let isAdmin = false
  if (user) {
    const { data: member } = await supabase.from('member').select('is_admin').eq('id', user.id).single()
    isAdmin = member?.is_admin ?? false
  }

  // Fetch elaboration + all related data
  const { data: elaboration } = await supabase
    .from('elaboration')
    .select(`
      *,
      sections:elaboration_section(*, updater:member!elaboration_section_updated_by_fkey(id, display_name, email)),
      editors:elaboration_editor(*, member:member!elaboration_editor_member_id_fkey(id, display_name, email))
    `)
    .eq('issue_id', params.id)
    .single()

  // Fetch comments for all sections
  const sectionComments: Record<string, ElaborationComment[]> = {}
  if (elaboration?.sections?.length) {
    const sectionIds = elaboration.sections.map((s: ElaborationSection) => s.id)
    const { data: comments } = await supabase
      .from('elaboration_comment')
      .select('*, author:member!elaboration_comment_author_id_fkey(*)')
      .in('section_id', sectionIds)
      .order('created_at', { ascending: true })

    for (const c of comments ?? []) {
      if (!sectionComments[c.section_id]) sectionComments[c.section_id] = []
      sectionComments[c.section_id].push(c as unknown as ElaborationComment)
    }
  }

  // Check if current user is an editor
  const isEditor = elaboration
    ? (elaboration.editors ?? []).some((e: ElaborationEditor) => e.member_id === user?.id)
    : false
  const canEdit = isAdmin || isEditor

  // Fetch all members for editor management
  let allMembers: Pick<Member, 'id' | 'display_name' | 'email'>[] = []
  if (isAdmin) {
    const { data } = await supabase
      .from('member')
      .select('id, display_name, email')
      .eq('is_approved', true)
      .order('display_name')
    allMembers = data ?? []
  }

  // Accepted initiative title
  const acceptedInitiative = (issue.initiatives as any[])?.find(
    (i: any) => i.id === issue.accepted_initiative_id
  )

  // Server actions
  async function createElaboration() {
    'use server'
    const supabase2 = createClient()
    const { data: { user: u } } = await supabase2.auth.getUser()
    if (!u) return

    const { data: elab } = await supabase2
      .from('elaboration')
      .insert({ issue_id: params.id, created_by: u.id })
      .select()
      .single()

    if (elab) {
      const sections = DEFAULT_SECTIONS.map((title, i) => ({
        elaboration_id: elab.id,
        title,
        content: '',
        sort_order: i,
      }))
      await supabase2.from('elaboration_section').insert(sections)
    }
    revalidatePath(`/proposals/${params.id}/elaboration`)
  }

  async function addSection(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    if (!title?.trim() || !elaboration) return
    const supabase2 = createClient()
    const maxOrder = Math.max(...(elaboration.sections ?? []).map((s: any) => s.sort_order), -1)
    await supabase2.from('elaboration_section').insert({
      elaboration_id: elaboration.id,
      title: title.trim(),
      content: '',
      sort_order: maxOrder + 1,
    })
    revalidatePath(`/proposals/${params.id}/elaboration`)
  }

  const sections = (elaboration?.sections ?? []).sort(
    (a: ElaborationSection, b: ElaborationSection) => a.sort_order - b.sort_order
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link href={`/proposals/${params.id}`} className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to topic
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileEdit className="w-7 h-7 text-accent" />
              Elaboration
            </h1>
            <p className="text-foreground/60 mt-1">{issue.title}</p>
            {acceptedInitiative && (
              <p className="text-sm text-auro-green mt-0.5">Accepted: {acceptedInitiative.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* No elaboration yet */}
      {!elaboration && (
        <div className="card text-center py-12 space-y-4">
          <FileEdit className="w-10 h-10 mx-auto text-foreground/20" />
          <div>
            <p className="font-medium">No elaboration document yet</p>
            <p className="text-sm text-foreground/50 mt-1">
              {isAdmin
                ? 'Create the elaboration document to start working out the details.'
                : 'The admin will create the elaboration document soon.'}
            </p>
          </div>
          {isAdmin && (
            <form action={createElaboration}>
              <button type="submit" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Elaboration Document
              </button>
            </form>
          )}
        </div>
      )}

      {/* Elaboration document */}
      {elaboration && (
        <>
          {/* Admin controls */}
          {isAdmin && (
            <div className="space-y-4">
              <ManageEditors
                elaborationId={elaboration.id}
                editors={(elaboration.editors ?? []) as ElaborationEditor[]}
                allMembers={allMembers}
              />

              {/* Add section */}
              <form action={addSection} className="flex gap-2">
                <input
                  name="title"
                  type="text"
                  placeholder="New section title…"
                  className="input flex-1 text-sm py-1.5"
                  required
                />
                <button type="submit" className="btn-primary px-3 py-1.5 flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </form>
            </div>
          )}

          {/* Sections */}
          {sections.length === 0 ? (
            <p className="text-sm text-foreground/40 text-center py-8">No sections yet.</p>
          ) : (
            <div className="space-y-4">
              {sections.map((section: ElaborationSection) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  comments={sectionComments[section.id] ?? []}
                  canEdit={canEdit}
                  userId={user?.id ?? null}
                />
              ))}
            </div>
          )}

          {!canEdit && user && (
            <p className="text-xs text-center text-foreground/40">
              You can comment on sections. Editing is restricted to selected editors.
            </p>
          )}
          {!user && (
            <p className="text-xs text-center text-foreground/40">
              <Link href="/auth/login" className="hover:text-accent underline">Sign in</Link> to comment.
            </p>
          )}
        </>
      )}
    </div>
  )
}
