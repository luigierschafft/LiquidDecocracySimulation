import { VirtueSideBorders } from '@/components/play/VirtueSideBorders'
import { PlayfulMenu } from '@/components/play/PlayfulMenu'

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dawn font-playful text-gray-800">
      <VirtueSideBorders />
      <PlayfulMenu />
      {/* Content sits between the fixed virtue borders (w-7 / sm:w-10); top padding clears the fixed menu */}
      <div className="px-10 sm:px-16 pt-16">
        {children}
      </div>
    </div>
  )
}
