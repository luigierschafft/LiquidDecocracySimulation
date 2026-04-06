import { ArrowRight, Vote } from 'lucide-react'
import { getMemberDisplayName } from '@/lib/utils'

interface DelegationInfo {
  to_member: { id: string; display_name: string | null; email: string }
  scope: 'issue' | 'area' | 'unit' | 'global'
  scopeLabel: string
}

interface Props {
  delegation: DelegationInfo | null
  hasDirectVote: boolean
}

export function DelegationStatus({ delegation, hasDirectVote }: Props) {
  if (!delegation) return null

  return (
    <div className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${
      hasDirectVote
        ? 'bg-stone-50 text-foreground/40'
        : 'bg-blue-50 text-blue-700'
    }`}>
      {hasDirectVote ? (
        <>
          <Vote className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>
            You voted directly — overriding your delegation to{' '}
            <strong>{getMemberDisplayName(delegation.to_member)}</strong>
          </span>
        </>
      ) : (
        <>
          <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>
            Your vote is delegated to{' '}
            <strong>{getMemberDisplayName(delegation.to_member)}</strong>
            {' '}({delegation.scopeLabel}). Vote directly above to override.
          </span>
        </>
      )}
    </div>
  )
}
