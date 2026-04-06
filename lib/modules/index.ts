import { createClient } from '@/lib/supabase/server'

export interface Module {
  key: string
  number: number
  name: string
  description: string
  group_key: string
  group_name: string
  admin_enabled: boolean
  user_configurable: boolean
}

export type ModuleMap = Record<string, boolean>

/**
 * Returns all modules (for admin use).
 */
export async function getAllModules(): Promise<Module[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('module')
    .select('*')
    .order('number', { ascending: true })
  return (data ?? []) as Module[]
}

/**
 * Returns the effective module state for a given user.
 * - If module is NOT user_configurable → admin_enabled is final
 * - If module IS user_configurable → user override wins if set, else admin_enabled
 */
export async function getEffectiveModules(userId?: string | null): Promise<ModuleMap> {
  const supabase = createClient()

  const { data: modules } = await supabase
    .from('module')
    .select('key, admin_enabled, user_configurable')

  if (!modules) return {}

  // Build base map from admin defaults
  const map: ModuleMap = {}
  for (const m of modules) {
    map[m.key] = m.admin_enabled
  }

  // Apply user overrides (only for user_configurable modules)
  if (userId) {
    const { data: overrides } = await supabase
      .from('member_module_setting')
      .select('module_key, enabled')
      .eq('member_id', userId)

    if (overrides) {
      for (const o of overrides) {
        // Only apply if module is user_configurable
        const mod = modules.find((m) => m.key === o.module_key)
        if (mod?.user_configurable) {
          map[o.module_key] = o.enabled
        }
      }
    }
  }

  return map
}

/**
 * Get user's own module overrides (for profile/settings page).
 */
export async function getUserModuleSettings(userId: string): Promise<Record<string, boolean>> {
  const supabase = createClient()
  const { data } = await supabase
    .from('member_module_setting')
    .select('module_key, enabled')
    .eq('member_id', userId)

  const result: Record<string, boolean> = {}
  for (const row of data ?? []) {
    result[row.module_key] = row.enabled
  }
  return result
}

/**
 * Get only user_configurable modules with their effective state for a user.
 */
export async function getUserConfigurableModules(userId: string): Promise<(Module & { effective: boolean })[]> {
  const supabase = createClient()

  const [modulesResult, overridesResult] = await Promise.all([
    supabase.from('module').select('*').eq('user_configurable', true).order('number'),
    supabase.from('member_module_setting').select('module_key, enabled').eq('member_id', userId),
  ])

  const modules = (modulesResult.data ?? []) as Module[]
  const overrides: Record<string, boolean> = {}
  for (const o of overridesResult.data ?? []) {
    overrides[o.module_key] = o.enabled
  }

  return modules.map((m) => ({
    ...m,
    effective: m.key in overrides ? overrides[m.key] : m.admin_enabled,
  }))
}
