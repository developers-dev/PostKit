// apps/web/src/app/api/ai/score-resume/route.ts

import { NextResponse } from 'next/server'
import { createOpenAIClient } from '@/lib/openai/client'
import { RESUME_SCORING_SYSTEM_PROMPT } from '@/lib/openai/prompts'

interface ScoringResult {
  total_score: number
  skill_score: number
  culture_score: number
  career_score: number
  strengths: string[]
  risks: string[]
  recommended_questions: string[]
  summary: string
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get('resume') as File | null
    const resumeText = formData.get('resumeText') as string | null
    const jobDescription = formData.get('jobDescription') as string
    const requirements = formData.get('requirements') as string

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    let extractedText = resumeText || ''

    // Extract text from PDF if file is provided
    if (resumeFile && !resumeText) {
      try {
        const arrayBuffer = await resumeFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Dynamic import for pdf-parse (only works on server)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse')
        const pdfData = await pdfParse(buffer)
        extractedText = pdfData.text
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError)
        return NextResponse.json(
          { error: 'Failed to parse PDF file' },
          { status: 400 }
        )
      }
    }

    if (!extractedText) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Return mock data if OpenAI is not configured
      const mockResult: ScoringResult = {
        total_score: Math.floor(Math.random() * 20) + 75,
        skill_score: Math.floor(Math.random() * 20) + 75,
        culture_score: Math.floor(Math.random() * 20) + 70,
        career_score: Math.floor(Math.random() * 20) + 75,
        strengths: [
          'Strong technical background with relevant experience',
          'Demonstrated leadership in previous roles',
          'Good problem-solving skills evident from projects',
        ],
        risks: [
          'Limited experience with some required technologies',
          'May require onboarding time for domain-specific knowledge',
        ],
        recommended_questions: [
          'Can you describe a challenging technical problem you solved recently?',
          'How do you approach learning new technologies?',
          'Tell us about your experience working in cross-functional teams.',
        ],
        summary:
          'A solid candidate with relevant technical skills and good career progression. Shows potential for growth and cultural fit.',
      }

      return NextResponse.json({ data: mockResult })
    }

    const openai = createOpenAIClient()

    const userPrompt = `Please evaluate the following resume against the job description and requirements.

## Job Description
${jobDescription}

## Requirements
${requirements || 'Not specified'}

## Resume Content
${extractedText}

Provide a comprehensive evaluation in the specified JSON format.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: RESUME_SCORING_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content in response')
    }

    const result: ScoringResult = JSON.parse(content)

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[ScoreResume API] Error:', error)

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to score resume' },
      { status: 500 }
    )
  }
}
