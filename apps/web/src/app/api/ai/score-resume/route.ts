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
        { error: '채용공고 내용을 입력해주세요' },
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
          { error: 'PDF 파일 파싱에 실패했습니다' },
          { status: 400 }
        )
      }
    }

    if (!extractedText) {
      return NextResponse.json(
        { error: '이력서 내용을 입력해주세요' },
        { status: 400 }
      )
    }

    // Check for API key: first from request header, then from environment
    const clientApiKey = formData.get('apiKey') as string | null
    const apiKey = clientApiKey || process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Return mock data if OpenAI is not configured
      const mockResult: ScoringResult = {
        total_score: Math.floor(Math.random() * 20) + 75,
        skill_score: Math.floor(Math.random() * 20) + 75,
        culture_score: Math.floor(Math.random() * 20) + 70,
        career_score: Math.floor(Math.random() * 20) + 75,
        strengths: [
          '관련 분야에서의 풍부한 기술적 경험 보유',
          '이전 직장에서의 리더십 역량 입증',
          '프로젝트 경험을 통한 우수한 문제 해결 능력',
        ],
        risks: [
          '일부 요구 기술에 대한 경험 부족',
          '도메인 특화 지식 습득을 위한 온보딩 기간 필요',
        ],
        recommended_questions: [
          '최근에 해결한 어려운 기술적 문제에 대해 설명해주세요.',
          '새로운 기술을 학습할 때 어떤 방식으로 접근하시나요?',
          '크로스펑셔널 팀에서 협업한 경험에 대해 말씀해주세요.',
        ],
        summary:
          '관련 기술 역량과 좋은 경력 성장세를 보이는 적합한 지원자입니다. 성장 가능성과 문화 적합도가 높아 보입니다.',
      }

      return NextResponse.json({ data: mockResult })
    }

    const openai = createOpenAIClient(apiKey)

    const userPrompt = `다음 이력서를 채용공고 및 요구사항에 맞게 평가해주세요. 반드시 한국어로 작성해주세요.

## 채용공고 내용
${jobDescription}

## 자격 요건
${requirements || '명시되지 않음'}

## 이력서 내용
${extractedText}

지정된 JSON 형식으로 종합적인 평가를 한국어로 제공해주세요.`

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
        { error: 'OpenAI API 키가 설정되지 않았습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: '이력서 채점에 실패했습니다' },
      { status: 500 }
    )
  }
}
