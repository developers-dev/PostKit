// apps/web/src/app/(dashboard)/layout.tsx

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let userEmail: string | undefined
  let companyName: string | undefined

  // Fetch user and company data if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        userEmail = user.email

        const { data: company } = await supabase
          .from('companies')
          .select('name')
          .eq('owner_id', user.id)
          .single()

        companyName = company?.name
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <Header userEmail={userEmail} companyName={companyName} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
