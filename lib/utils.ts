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
    admission: 'Discussion',
    discussion: 'Proposal',
    verification: 'Verification',
    voting: 'Voting',
    closed: 'Closed',
  }
  return labels[status] ?? status
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    admission: 'bg-blue-100 text-blue-800',
    discussion: 'bg-amber-100 text-amber-800',
    verification: 'bg-purple-100 text-purple-800',
    voting: 'bg-green-100 text-green-800',
    closed: 'bg-stone-100 text-stone-600',
  }
  return colors[status] ?? 'bg-stone-100 text-stone-600'
}

export function truncate(text: string, length = 120): string {
  return text.length > length ? text.slice(0, length) + '…' : text
}

export function getStatusVariant(status: string): 'default' | 'sand' | 'green' | 'blue' | 'purple' {
  const variants: Record<string, 'default' | 'sand' | 'green' | 'blue' | 'purple'> = {
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
