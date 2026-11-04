import { VirtueSideBorders } from '@/components/play/VirtueSideBorders'
import { PlayfulMenu } from '@/components/play/PlayfulMenu'

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f0eb] font-[family-name:var(--font-geist-sans)]">
      <VirtueSideBorders />
      <PlayfulMenu />
      {/* Content sits between the fixed virtue borders; top padding keeps it clear of the fixed menu */}
      <div className="px-[11vw] sm:px-12 pt-12">
        {children}
      </div>
    </div>
  )
}
