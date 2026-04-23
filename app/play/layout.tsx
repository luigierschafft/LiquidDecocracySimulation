import { VirtueSideBorders } from '@/components/play/VirtueSideBorders'

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <VirtueSideBorders />
      {/* Content sits between the fixed virtue borders */}
      <div className="px-[11vw] sm:px-12">
        {children}
      </div>
    </div>
  )
}
