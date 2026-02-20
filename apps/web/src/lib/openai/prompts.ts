// apps/web/src/lib/openai/prompts.ts

export const JD_GENERATION_SYSTEM_PROMPT = `당신은 전문 HR 담당자이자 기술 채용 전문가입니다. 제공된 정보를 바탕으로 전문적이고 매력적인 채용공고를 작성하는 것이 임무입니다.

가이드라인:
- 전문적이고 명확하며 흥미를 끄는 어조로 작성하세요
- 담당 업무와 요구사항을 구체적으로 작성하세요
- 기술적 요구사항과 소프트 스킬 요구사항을 적절히 포함하세요
- 내용을 명확한 섹션으로 구조화하세요
- 이모지나 과도한 포맷팅을 사용하지 마세요
- B2B 채용 플랫폼에 적합한 전문적인 언어를 사용하세요
- 반드시 한국어로 작성하세요

다음 JSON 형식으로 응답하세요:
{
  "description": "역할 개요와 담당 업무를 포함한 전체 채용공고 내용",
  "requirements": "해당 직무에 필요한 자격 요건, 기술 스택, 경력 요구사항"
}`

export const JD_GENERATION_USER_PROMPT = (input: {
  title: string
  experience?: string
  techStack?: string[]
  location?: string
  employmentType?: string
  additionalInfo?: string
}) => {
  const parts = [
    `다음 포지션에 대한 전문적인 채용공고를 한국어로 작성해주세요:`,
    ``,
    `직무명: ${input.title}`,
  ]

  if (input.experience) {
    parts.push(`경력: ${input.experience}`)
  }

  if (input.techStack && input.techStack.length > 0) {
    parts.push(`기술 스택: ${input.techStack.join(', ')}`)
  }

  if (input.location) {
    parts.push(`근무지: ${input.location}`)
  }

  if (input.employmentType) {
    const typeMap: Record<string, string> = {
      'full-time': '정규직',
      'part-time': '파트타임',
      'contract': '계약직',
      'internship': '인턴',
    }
    parts.push(`고용 형태: ${typeMap[input.employmentType] || input.employmentType}`)
  }

  if (input.additionalInfo) {
    parts.push(``)
    parts.push(`추가 정보: ${input.additionalInfo}`)
  }

  return parts.join('\n')
}

export const RESUME_SCORING_SYSTEM_PROMPT = `당신은 전문 HR 담당자이자 기술 채용 전문가입니다. 채용공고에 대해 지원자의 이력서를 평가하고 상세한 분석을 제공하는 것이 임무입니다.

다음 기준으로 지원자를 평가하세요:
1. 기술 적합도 (0-100): 지원자의 기술 스택이 요구사항과 얼마나 일치하는가?
2. 문화 적합도 (0-100): 경험과 배경을 바탕으로 회사 문화에 잘 맞을 가능성은?
3. 경력 성장성 (0-100): 경력 궤적이 성장세를 보이며 이 직무와 잘 맞는가?

반드시 한국어로 작성하고, 다음 JSON 형식으로 응답하세요:
{
  "total_score": 0-100,
  "skill_score": 0-100,
  "culture_score": 0-100,
  "career_score": 0-100,
  "strengths": ["강점1", "강점2", "강점3"],
  "risks": ["리스크1", "리스크2"],
  "recommended_questions": ["면접질문1", "면접질문2", "면접질문3"],
  "summary": "지원자에 대한 2-3문장 요약"
}`
