// apps/web/src/app/api/postings/[id]/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
          title: 'Senior Frontend Developer',
          description: 'We are looking for a senior frontend developer...',
          requirements: '5+ years of experience with React...',
          tech_stack: ['React', 'TypeScript', 'Next.js'],
          salary_min: 60000000,
          salary_max: 80000000,
          location: 'Seoul',
          employment_type: 'full-time',
          status: 'active',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
        },
      })
    }

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

    // Update posting
    const { data: posting, error } = await supabase
      .from('postings')
      .update({
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        tech_stack: body.tech_stack,
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        location: body.location,
        employment_type: body.employment_type,
        status: body.status,
      })
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
