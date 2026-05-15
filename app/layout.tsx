import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { getEffectiveModules } from '@/lib/modules'
import { MeditationProvider } from '@/components/meditation/MeditationProvider'
import { ModulesContext } from '@/components/ModulesContext'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Liquid Democracy Auroville',
  description: 'Participatory governance for the Auroville community',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Load admin-level module defaults for nav visibility (no userId = global defaults)
  const modules = await getEffectiveModules(null)

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Navbar
          showDelegation={modules.delegation}
          showGovernance={modules.governance_rules}
          showNotifications={modules.notifications}
          showVotingCycles={modules.voting_cycles}
        />
        <ModulesContext.Provider
          value={{
            disapprove_reason: modules.disapprove_reason ?? false,
            strong_no_needs: modules.strong_no_needs ?? false,
            position_paper: modules.position_paper ?? false,
            impact_level: modules.impact_level ?? false,
          }}
        >
          <MeditationProvider
            firstComment={modules.meditation_first_comment ?? false}
            every15min={modules.meditation_every_15min ?? false}
          >
            <main className="min-h-screen">{children}</main>
          </MeditationProvider>
        </ModulesContext.Provider>
      </body>
    </html>
  )
}
