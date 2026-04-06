import { CheckCircle2 } from 'lucide-react'

export function VerifiedBadge() {
  return (
    <span
      title="Verified member"
      className="inline-flex items-center text-blue-500"
    >
      <CheckCircle2 className="w-4 h-4" />
    </span>
  )
}
