// packages/shared-types/src/posting.ts

export interface Posting {
  id: string
  companyId: string
  title: string
  description: string | null
  requirements: string | null
  techStack: string[]
  salaryMin: number | null
  salaryMax: number | null
  location: string | null
  employmentType: EmploymentType
  status: PostingStatus
  platformPostIds: Record<string, string>
  createdAt: string
  updatedAt: string
}

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship'

export type PostingStatus = 'draft' | 'active' | 'closed'

export interface CreatePostingInput {
  title: string
  description?: string
  requirements?: string
  techStack?: string[]
  salaryMin?: number
  salaryMax?: number
  location?: string
  employmentType?: EmploymentType
}

export interface UpdatePostingInput extends Partial<CreatePostingInput> {
  status?: PostingStatus
}
