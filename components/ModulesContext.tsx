'use client'
import { createContext, useContext } from 'react'

interface ModulesCtx {
  disapprove_reason: boolean
  strong_no_needs: boolean
  position_paper: boolean
  impact_level: boolean
  hate_speech_filter: boolean
  auroville_texts: boolean
  empathy_tool: boolean
}

const ModulesContext = createContext<ModulesCtx>({
  disapprove_reason: false,
  strong_no_needs: false,
  position_paper: false,
  impact_level: false,
  hate_speech_filter: false,
  auroville_texts: false,
  empathy_tool: false,
})

export function useModules() { return useContext(ModulesContext) }

export function ModulesProvider({ children, value }: { children: React.ReactNode; value: ModulesCtx }) {
  return <ModulesContext.Provider value={value}>{children}</ModulesContext.Provider>
}
