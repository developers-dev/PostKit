// packages/shared-types/src/company.ts

export interface Company {
  id: string
  name: string
  industry: string | null
  size: CompanySize | null
  ownerId: string
  createdAt: string
}

export type CompanySize =
  | 'startup'
  | 'small'
  | 'medium'
  | 'large'
  | 'enterprise'

export interface CreateCompanyInput {
  name: string
  industry?: string
  size?: CompanySize
}
