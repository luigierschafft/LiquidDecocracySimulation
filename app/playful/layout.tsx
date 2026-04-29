import { VirtueSideBorders } from '@/components/play/VirtueSideBorders'
import { PlayfulMenu } from '@/components/play/PlayfulMenu'

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <VirtueSideBorders />
      <PlayfulMenu />
      {/* Content sits between the fixed virtue borders */}
      <div className="px-[11vw] sm:px-12">
        {children}
      </div>
    </div>
  )
}
