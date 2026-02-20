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
    const body: GenerateJDRequest & { apiKey?: string } = await request.json()

    // Check for API key: first from request body, then from environment
    const apiKey = body.apiKey || process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Return mock data if OpenAI is not configured
      const employmentTypeMap: Record<string, string> = {
        'full-time': '정규직',
        'part-time': '파트타임',
        'contract': '계약직',
        'internship': '인턴',
      }
      const empType = employmentTypeMap[body.employmentType || 'full-time'] || '정규직'

      const mockDescription = `${body.title} 포지션에 함께할 인재를 찾고 있습니다.

[담당 업무]
• 고품질의 솔루션 설계 및 구현
• 크로스펑셔널 팀과 협업하여 새로운 기능 정의 및 개발
• 깔끔하고 유지보수 가능한 효율적인 코드 작성
• 코드 리뷰 참여 및 건설적인 피드백 제공
• 아키텍처 결정 및 기술 논의에 기여
${body.techStack && body.techStack.length > 0 ? `• ${body.techStack.join(', ')} 등의 기술 스택을 활용한 개발` : ''}

[근무 조건]
• 고용 형태: ${empType}
${body.location ? `• 근무지: ${body.location}` : ''}`

      const mockRequirements = `[필수 요건]
• ${body.experience || '3년 이상'}의 관련 분야 실무 경험
${body.techStack && body.techStack.length > 0 ? `• ${body.techStack.slice(0, 3).join(', ')} 능숙한 활용 능력` : '• 해당 직무와 관련된 기술 역량'}
• 뛰어난 문제 해결 및 분석 능력
• 원활한 커뮤니케이션 능력과 팀워크
• 애자일 개발 방법론 경험

[우대 사항]
• 클라우드 플랫폼(AWS, GCP, Azure) 경험
• 오픈소스 프로젝트 기여 경험
• 주니어 개발자 멘토링 경험`

      return NextResponse.json({
        data: {
          description: mockDescription,
          requirements: mockRequirements,
        },
      })
    }

    if (!body.title) {
      return NextResponse.json(
        { error: '직무명을 입력해주세요' },
        { status: 400 }
      )
    }

    const openai = createOpenAIClient(apiKey)

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
        { error: 'OpenAI API 키가 설정되지 않았습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: '채용공고 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
