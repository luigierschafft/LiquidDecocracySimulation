import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    admission: 'Discussion',
    discussion: 'Proposal',
    verification: 'Verification',
    voting: 'Voting',
    closed: 'Closed',
  }
  return labels[status] ?? status
}

export function getStatusVariant(status: string): 'default' | 'sand' | 'green' | 'blue' | 'purple' {
  const variants: Record<string, 'default' | 'sand' | 'green' | 'blue' | 'purple'> = {
    draft: 'sand',
    admission: 'blue',
    discussion: 'sand',
    verification: 'purple',
    voting: 'green',
    closed: 'sand',
  }
  return variants[status] ?? 'sand'
}

export function getMemberDisplayName(
  member: { display_name?: string | null; email?: string | null } | null | undefined
): string {
  return member?.display_name ?? member?.email ?? '?'
}

/**
 * Sanitise a user-supplied `?next=` redirect target: only same-site absolute
 * paths are allowed (blocks open redirects like `//evil.com` or `https://…`).
 */
export function safeRedirectPath(next: string | null | undefined, fallback = '/topics'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback
  return next
}
