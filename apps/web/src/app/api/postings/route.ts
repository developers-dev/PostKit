// apps/web/src/app/api/postings/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
            title: 'Senior Frontend Developer',
            status: 'active',
            location: 'Seoul',
            employment_type: 'full-time',
            created_at: '2024-01-15T00:00:00Z',
          },
          {
            id: '2',
            title: 'Backend Developer',
            status: 'active',
            location: 'Seoul',
            employment_type: 'full-time',
            created_at: '2024-01-18T00:00:00Z',
          },
        ],
      })
    }

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

    // Get postings
    const { data: postings, error } = await supabase
      .from('postings')
      .select('*')
      .eq('company_id', company.id)
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

    // Create posting
    const { data: posting, error } = await supabase
      .from('postings')
      .insert({
        company_id: company.id,
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
