'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleModuleAdmin(key: string, enabled: boolean) {
  const supabase = createClient()
  await supabase
    .from('module')
    .update({ admin_enabled: enabled })
    .eq('key', key)
  revalidatePath('/admin/modules')
}

export async function toggleModuleUserConfigurable(key: string, userConfigurable: boolean) {
  const supabase = createClient()
  await supabase
    .from('module')
    .update({ user_configurable: userConfigurable })
    .eq('key', key)
  revalidatePath('/admin/modules')
}
