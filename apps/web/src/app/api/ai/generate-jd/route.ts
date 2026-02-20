// apps/web/src/app/api/ai/generate-jd/route.ts

import { NextResponse } from 'next/server'
import { createOpenAIClient } from '@/lib/openai/client'
import {
  JD_GENERATION_SYSTEM_PROMPT,
  JD_GENERATION_USER_PROMPT,
} from '@/lib/openai/prompts'

interface GenerateJDRequest {
  title: string
  experience?: string
  techStack?: string[]
  location?: string
  employmentType?: string
  additionalInfo?: string
}

interface GeneratedJD {
  description: string
  requirements: string
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Return mock data if OpenAI is not configured
      const body: GenerateJDRequest = await request.json()

      const mockDescription = `We are looking for a talented ${body.title} to join our team.

As a ${body.title}, you will be responsible for:
- Designing and implementing high-quality solutions
- Collaborating with cross-functional teams to define and ship new features
- Writing clean, maintainable, and efficient code
- Participating in code reviews and providing constructive feedback
- Contributing to architectural decisions and technical discussions
${body.techStack && body.techStack.length > 0 ? `- Working with technologies including ${body.techStack.join(', ')}` : ''}

This is a ${body.employmentType || 'full-time'} position${body.location ? ` based in ${body.location}` : ''}.`

      const mockRequirements = `Required Qualifications:
- ${body.experience || '3+ years'} of professional experience in a similar role
${body.techStack && body.techStack.length > 0 ? `- Strong proficiency in ${body.techStack.slice(0, 3).join(', ')}` : '- Strong technical skills relevant to the role'}
- Excellent problem-solving and analytical skills
- Strong communication skills and ability to work in a team
- Experience with agile development methodologies

Nice to Have:
- Experience with cloud platforms (AWS, GCP, or Azure)
- Contributions to open-source projects
- Experience mentoring junior developers`

      return NextResponse.json({
        data: {
          description: mockDescription,
          requirements: mockRequirements,
        },
      })
    }

    const body: GenerateJDRequest = await request.json()

    if (!body.title) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    const openai = createOpenAIClient()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: JD_GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: JD_GENERATION_USER_PROMPT(body) },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content in response')
    }

    const result: GeneratedJD = JSON.parse(content)

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[GenerateJD API] Error:', error)

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate job description' },
      { status: 500 }
    )
  }
}
