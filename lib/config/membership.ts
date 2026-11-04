/**
 * Whether new members must be approved by an admin before they show up in
 * member lists (delegation, mentions, editors, reminders).
 *
 * Currently OFF: everyone who signs in can participate right away.
 * To turn approval on later, set this to `true` AND change the database
 * default back (see supabase/migrations/20261104000001_open_membership.sql).
 */
export const REQUIRE_MEMBER_APPROVAL = false

/**
 * Values of `member.is_approved` that count as "active member".
 * Use as `.in('is_approved', ACTIVE_MEMBER_APPROVAL)` so query chains stay intact.
 */
export const ACTIVE_MEMBER_APPROVAL: boolean[] = REQUIRE_MEMBER_APPROVAL ? [true] : [true, false]
