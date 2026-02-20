// apps/web/src/lib/supabase/admin.ts

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

// Fixed demo IDs - will be created on first use
export const DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001'
export const DEMO_COMPANY_NAME = 'Recruify Demo Company'
export const DEMO_USER_EMAIL = 'demo@recruify.local'

let adminClientInstance: SupabaseClient | null = null
let demoUserId: string | null = null

// Service role client for demo mode - bypasses RLS
export function createAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured')
  }

  // If service role key is available, use it (bypasses RLS)
  if (serviceRoleKey) {
    adminClientInstance = createSupabaseClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    return adminClientInstance
  }

  // Fallback: use anon key (requires RLS to allow demo operations)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!anonKey) {
    throw new Error('Supabase keys are not configured')
  }

  console.warn('[Admin] Using anon key for demo mode - some operations may be restricted')
  adminClientInstance = createSupabaseClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return adminClientInstance
}

// Check if service role is available
export function hasServiceRole(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Ensure demo user exists and return their ID
async function ensureDemoUser(): Promise<string> {
  if (demoUserId) {
    return demoUserId
  }

  const supabase = createAdminClient()

  // Try to find existing demo user
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingDemoUser = existingUsers?.users?.find(u => u.email === DEMO_USER_EMAIL)

  if (existingDemoUser) {
    demoUserId = existingDemoUser.id
    return demoUserId
  }

  // Create demo user
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email: DEMO_USER_EMAIL,
    password: 'demo-password-not-for-login',
    email_confirm: true,
  })

  if (createError) {
    console.error('[Demo] Failed to create demo user:', createError)
    throw new Error('Failed to create demo user')
  }

  if (!newUser.user) {
    throw new Error('Demo user creation returned no user')
  }

  demoUserId = newUser.user.id
  console.log('[Demo] Created demo user:', demoUserId)
  return demoUserId
}

// Ensure demo company exists
export async function ensureDemoCompany(): Promise<string> {
  try {
    const supabase = createAdminClient()

    // First ensure demo user exists
    const userId = await ensureDemoUser()

    // Check if demo company exists
    const { data: existing, error: selectError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', DEMO_COMPANY_ID)
      .maybeSingle()

    if (selectError) {
      console.error('[Demo] Error checking demo company:', selectError)
    }

    if (!existing) {
      const { error: insertError } = await supabase.from('companies').insert({
        id: DEMO_COMPANY_ID,
        name: DEMO_COMPANY_NAME,
        owner_id: userId,
      })

      if (insertError) {
        // 23505 = unique violation (already exists) - this is OK
        if (insertError.code !== '23505') {
          console.error('[Demo] Failed to create demo company:', insertError)
        }
      } else {
        console.log('[Demo] Created demo company')
      }
    }

    return DEMO_COMPANY_ID
  } catch (error) {
    console.error('[Demo] Error in ensureDemoCompany:', error)
    throw error
  }
}
