// packages/shared-types/src/applicant.ts

export interface Applicant {
  id: string
  postingId: string
  name: string
  applyPlatform: ApplyPlatform
  totalScore: number | null
  skillScore: number | null
  cultureScore: number | null
  careerScore: number | null
  strengths: string[]
  risks: string[]
  recommendedQuestions: string[]
  stage: ApplicantStage
  memo: string | null
  createdAt: string
  updatedAt: string
}

export type ApplyPlatform =
  | 'jobkorea'
  | 'saramin'
  | 'wanted'
  | 'jumpit'
  | 'direct'

export type ApplicantStage =
  | 'applied'
  | 'screening'
  | 'interview1'
  | 'interview2'
  | 'final'
  | 'hired'
  | 'rejected'

export interface ScoringResult {
  totalScore: number
  skillScore: number
  cultureScore: number
  careerScore: number
  strengths: string[]
  risks: string[]
  recommendedQuestions: string[]
  summary: string
}

export interface CreateApplicantInput {
  postingId: string
  name: string
  applyPlatform: ApplyPlatform
  scoringResult?: ScoringResult
}

export interface UpdateApplicantInput {
  stage?: ApplicantStage
  memo?: string
}
