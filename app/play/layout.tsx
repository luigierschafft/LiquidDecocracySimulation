import { VirtueSideBorders } from '@/components/play/VirtueSideBorders'

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50">
      <VirtueSideBorders />
      {/* Padding keeps content clear of the fixed virtue borders */}
      <div className="px-[10vw] sm:px-10">
        {children}
      </div>
    </div>
  )
}
