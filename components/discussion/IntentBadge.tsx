import type { OpinionIntent } from '@/lib/types'

const INTENT_CONFIG: Record<OpinionIntent, { label: string; color: string }> = {
  support:  { label: 'Support',  color: 'bg-green-100 text-green-700' },
  concern:  { label: 'Concern',  color: 'bg-amber-100 text-amber-700' },
  question: { label: 'Question', color: 'bg-blue-100 text-blue-700' },
  info:     { label: 'Info',     color: 'bg-sand text-foreground/60' },
}

interface Props {
  intent: OpinionIntent
}

export function IntentBadge({ intent }: Props) {
  const { label, color } = INTENT_CONFIG[intent]
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${color}`}>
      {label}
    </span>
  )
}

interface PickerProps {
  value: OpinionIntent | null
  onChange: (v: OpinionIntent | null) => void
}

export function IntentPicker({ value, onChange }: PickerProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-foreground/40 mr-0.5">Intent:</span>
      {(Object.entries(INTENT_CONFIG) as [OpinionIntent, { label: string; color: string }][]).map(([key, cfg]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(value === key ? null : key)}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all border ${
            value === key
              ? `${cfg.color} border-current`
              : 'bg-background text-foreground/40 border-sand hover:border-foreground/20'
          }`}
        >
          {cfg.label}
        </button>
      ))}
    </div>
  )
}
