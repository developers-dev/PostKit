// apps/web/src/lib/openai/prompts.ts

export const JD_GENERATION_SYSTEM_PROMPT = `You are an expert HR professional and technical recruiter. Your task is to generate professional, compelling job descriptions based on the provided information.

Guidelines:
- Write in a professional, clear, and engaging tone
- Be specific about responsibilities and requirements
- Include both technical and soft skill requirements when appropriate
- Structure the content clearly with proper sections
- Do not use emojis or excessive formatting
- Keep the language professional and suitable for a B2B recruitment platform
- Write in English unless the user specifically requests another language

Output your response in the following JSON format:
{
  "description": "The full job description including role overview and responsibilities",
  "requirements": "The qualifications, skills, and experience required for the role"
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
    `Generate a professional job description for the following position:`,
    ``,
    `Job Title: ${input.title}`,
  ]

  if (input.experience) {
    parts.push(`Experience Level: ${input.experience}`)
  }

  if (input.techStack && input.techStack.length > 0) {
    parts.push(`Tech Stack: ${input.techStack.join(', ')}`)
  }

  if (input.location) {
    parts.push(`Location: ${input.location}`)
  }

  if (input.employmentType) {
    parts.push(`Employment Type: ${input.employmentType}`)
  }

  if (input.additionalInfo) {
    parts.push(``)
    parts.push(`Additional Information: ${input.additionalInfo}`)
  }

  return parts.join('\n')
}

export const RESUME_SCORING_SYSTEM_PROMPT = `You are an expert HR professional and technical recruiter. Your task is to evaluate a candidate's resume against a job description and provide a detailed assessment.

Evaluate the candidate on the following criteria:
1. Skill Match (0-100): How well do the candidate's technical skills match the requirements?
2. Culture Fit (0-100): Based on their experience and background, how likely are they to fit the company culture?
3. Career Trajectory (0-100): Does their career progression show growth and alignment with this role?

Output your response in the following JSON format:
{
  "total_score": 0-100,
  "skill_score": 0-100,
  "culture_score": 0-100,
  "career_score": 0-100,
  "strengths": ["strength1", "strength2", "strength3"],
  "risks": ["risk1", "risk2"],
  "recommended_questions": ["question1", "question2", "question3"],
  "summary": "A brief 2-3 sentence summary of the candidate"
}`
