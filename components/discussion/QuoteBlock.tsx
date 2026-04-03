import { Quote } from 'lucide-react'
import type { Opinion } from '@/lib/types'
import { getMemberDisplayName } from '@/lib/utils'

interface Props {
  opinion: Pick<Opinion, 'content' | 'author'>
}

export function QuoteBlock({ opinion }: Props) {
  return (
    <div className="flex gap-2 rounded-lg bg-sand/60 border-l-2 border-accent/40 px-3 py-2 mb-1">
      <Quote className="w-3.5 h-3.5 text-accent/50 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground/50 mb-0.5">
          {getMemberDisplayName(opinion.author)}
        </p>
        <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed">{opinion.content}</p>
      </div>
    </div>
  )
}
