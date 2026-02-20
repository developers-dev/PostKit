// apps/web/src/app/api/postings/[id]/route.ts

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, ensureDemoCompany, DEMO_COMPANY_ID } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        data: {
          id,
          title: '시니어 프론트엔드 개발자',
          description: '시니어 프론트엔드 개발자를 모집합니다...',
          requirements: 'React 5년 이상 경력자...',
          tech_stack: ['React', 'TypeScript', 'Next.js'],
          salary_min: 60000000,
          salary_max: 80000000,
          location: '서울',
          employment_type: 'full-time',
          status: 'active',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
        },
      })
    }

    // Check for demo session
    const cookieStore = await cookies()
    const isDemoSession = cookieStore.get('postkit_demo')?.value === 'true'

    if (isDemoSession) {
      // Demo mode: use admin client
      await ensureDemoCompany()
      const supabase = createAdminClient()

      const { data: posting, error } = await supabase
        .from('postings')
        .select('*')
        .eq('id', id)
        .eq('company_id', DEMO_COMPANY_ID)
        .single()

      if (error || !posting) {
        return NextResponse.json({ error: 'Posting not found' }, { status: 404 })
      }

      return NextResponse.json({ data: posting })
    }

    // Normal mode: use authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: posting, error } = await supabase
      .from('postings')
      .select('*, companies!inner(owner_id)')
      .eq('id', id)
      .eq('companies.owner_id', user.id)
      .single()

    if (error || !posting) {
      return NextResponse.json({ error: 'Posting not found' }, { status: 404 })
    }

    return NextResponse.json({ data: posting })
  } catch (error) {
    console.error('[PostingsAPI] GET error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Return mock response if Supabase is not configured
      return NextResponse.json({
        data: {
          id,
          ...body,
          updated_at: new Date().toISOString(),
        },
      })
    }

    // Check for demo session
    const cookieStore = await cookies()
    const isDemoSession = cookieStore.get('postkit_demo')?.value === 'true'

    if (isDemoSession) {
      // Demo mode: use admin client
      await ensureDemoCompany()
      const supabase = createAdminClient()

      // Verify ownership (must belong to demo company)
      const { data: existing } = await supabase
        .from('postings')
        .select('id')
        .eq('id', id)
        .eq('company_id', DEMO_COMPANY_ID)
        .single()

      if (!existing) {
        return NextResponse.json({ error: 'Posting not found' }, { status: 404 })
      }

      // Build update object with only provided fields
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }
      if (body.title !== undefined) updateData.title = body.title
      if (body.description !== undefined) updateData.description = body.description
      if (body.requirements !== undefined) updateData.requirements = body.requirements
      if (body.tech_stack !== undefined) updateData.tech_stack = body.tech_stack
      if (body.salary_min !== undefined) updateData.salary_min = body.salary_min
      if (body.salary_max !== undefined) updateData.salary_max = body.salary_max
      if (body.location !== undefined) updateData.location = body.location
      if (body.employment_type !== undefined) updateData.employment_type = body.employment_type
      if (body.status !== undefined) updateData.status = body.status

      // Update posting
      const { data: posting, error } = await supabase
        .from('postings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[PostingsAPI] PUT error:', error)
        return NextResponse.json({ error: 'Failed to update posting' }, { status: 500 })
      }

      return NextResponse.json({ data: posting })
    }

    // Normal mode: use authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('postings')
      .select('*, companies!inner(owner_id)')
      .eq('id', id)
      .eq('companies.owner_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Posting not found' }, { status: 404 })
    }

    // Build update object with only provided fields
    const normalUpdateData: Record<string, unknown> = {}
    if (body.title !== undefined) normalUpdateData.title = body.title
    if (body.description !== undefined) normalUpdateData.description = body.description
    if (body.requirements !== undefined) normalUpdateData.requirements = body.requirements
    if (body.tech_stack !== undefined) normalUpdateData.tech_stack = body.tech_stack
    if (body.salary_min !== undefined) normalUpdateData.salary_min = body.salary_min
    if (body.salary_max !== undefined) normalUpdateData.salary_max = body.salary_max
    if (body.location !== undefined) normalUpdateData.location = body.location
    if (body.employment_type !== undefined) normalUpdateData.employment_type = body.employment_type
    if (body.status !== undefined) normalUpdateData.status = body.status

    // Update posting
    const { data: posting, error } = await supabase
      .from('postings')
      .update(normalUpdateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[PostingsAPI] PUT error:', error)
      return NextResponse.json({ error: 'Failed to update posting' }, { status: 500 })
    }

    return NextResponse.json({ data: posting })
  } catch (error) {
    console.error('[PostingsAPI] PUT error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Return mock response if Supabase is not configured
      return NextResponse.json({ success: true })
    }

    // Check for demo session
    const cookieStore = await cookies()
    const isDemoSession = cookieStore.get('postkit_demo')?.value === 'true'

    if (isDemoSession) {
      // Demo mode: use admin client
      await ensureDemoCompany()
      const supabase = createAdminClient()

      // Verify ownership (must belong to demo company)
      const { data: existing } = await supabase
        .from('postings')
        .select('id')
        .eq('id', id)
        .eq('company_id', DEMO_COMPANY_ID)
        .single()

      if (!existing) {
        return NextResponse.json({ error: 'Posting not found' }, { status: 404 })
      }

      // Delete posting
      const { error } = await supabase
        .from('postings')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[PostingsAPI] DELETE error:', error)
        return NextResponse.json({ error: 'Failed to delete posting' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    // Normal mode: use authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('postings')
      .select('*, companies!inner(owner_id)')
      .eq('id', id)
      .eq('companies.owner_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Posting not found' }, { status: 404 })
    }

    // Delete posting
    const { error } = await supabase
      .from('postings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[PostingsAPI] DELETE error:', error)
      return NextResponse.json({ error: 'Failed to delete posting' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PostingsAPI] DELETE error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
