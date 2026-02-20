// apps/web/src/app/api/postings/route.ts

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, ensureDemoCompany, DEMO_COMPANY_ID } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        data: [
          {
            id: '1',
            title: '시니어 프론트엔드 개발자',
            status: 'active',
            location: '서울',
            employment_type: 'full-time',
            created_at: '2024-01-15T00:00:00Z',
          },
          {
            id: '2',
            title: '백엔드 개발자',
            status: 'active',
            location: '서울',
            employment_type: 'full-time',
            created_at: '2024-01-18T00:00:00Z',
          },
        ],
      })
    }

    // Check for demo session
    const cookieStore = await cookies()
    const isDemoSession = cookieStore.get('postkit_demo')?.value === 'true'

    let companyId: string

    if (isDemoSession) {
      // Demo mode: use admin client and demo company
      try {
        await ensureDemoCompany()
        companyId = DEMO_COMPANY_ID

        const supabase = createAdminClient()
        const { data: postings, error } = await supabase
          .from('postings')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[PostingsAPI] GET demo error:', error)
          // Fall back to empty list instead of error
          return NextResponse.json({ data: [] })
        }

        return NextResponse.json({ data: postings || [] })
      } catch (demoError) {
        console.error('[PostingsAPI] Demo mode error:', demoError)
        // Return empty list for demo mode when DB is not fully configured
        return NextResponse.json({ data: [] })
      }
    }

    // Normal mode: use authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    companyId = company.id

    // Get postings
    const { data: postings, error } = await supabase
      .from('postings')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[PostingsAPI] GET error:', error)
      return NextResponse.json({ error: 'Failed to fetch postings' }, { status: 500 })
    }

    return NextResponse.json({ data: postings })
  } catch (error) {
    console.error('[PostingsAPI] GET error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const body = await request.json()

    if (!supabaseUrl || !supabaseKey) {
      // Return mock response if Supabase is not configured
      return NextResponse.json({
        data: {
          id: crypto.randomUUID(),
          ...body,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      })
    }

    // Check for demo session
    const cookieStore = await cookies()
    const isDemoSession = cookieStore.get('postkit_demo')?.value === 'true'

    let companyId: string

    if (isDemoSession) {
      // Demo mode: use admin client and demo company
      try {
        await ensureDemoCompany()
        companyId = DEMO_COMPANY_ID

        const supabase = createAdminClient()
        const { data: posting, error } = await supabase
          .from('postings')
          .insert({
            company_id: companyId,
            title: body.title,
            description: body.description,
            requirements: body.requirements,
            tech_stack: body.tech_stack || [],
            salary_min: body.salary_min,
            salary_max: body.salary_max,
            location: body.location,
            employment_type: body.employment_type || 'full-time',
            status: body.status || 'active',
          })
          .select()
          .single()

        if (error) {
          console.error('[PostingsAPI] POST demo error:', error)
          return NextResponse.json({
            error: 'DB 쓰기 권한이 없습니다. SUPABASE_SERVICE_ROLE_KEY를 설정하세요.'
          }, { status: 500 })
        }

        return NextResponse.json({ data: posting })
      } catch (demoError) {
        console.error('[PostingsAPI] Demo mode POST error:', demoError)
        return NextResponse.json({
          error: '데모 모드에서 DB 연결에 실패했습니다.'
        }, { status: 500 })
      }
    }

    // Normal mode: use authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    companyId = company.id

    // Create posting
    const { data: posting, error } = await supabase
      .from('postings')
      .insert({
        company_id: companyId,
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        tech_stack: body.tech_stack || [],
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        location: body.location,
        employment_type: body.employment_type || 'full-time',
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('[PostingsAPI] POST error:', error)
      return NextResponse.json({ error: 'Failed to create posting' }, { status: 500 })
    }

    return NextResponse.json({ data: posting })
  } catch (error) {
    console.error('[PostingsAPI] POST error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
