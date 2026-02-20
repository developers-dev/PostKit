// apps/web/src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null
          owner_id?: string
          created_at?: string
        }
      }
      postings: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string | null
          requirements: string | null
          tech_stack: string[]
          salary_min: number | null
          salary_max: number | null
          location: string | null
          employment_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          status: 'draft' | 'active' | 'closed'
          platform_post_ids: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          description?: string | null
          requirements?: string | null
          tech_stack?: string[]
          salary_min?: number | null
          salary_max?: number | null
          location?: string | null
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          status?: 'draft' | 'active' | 'closed'
          platform_post_ids?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          description?: string | null
          requirements?: string | null
          tech_stack?: string[]
          salary_min?: number | null
          salary_max?: number | null
          location?: string | null
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          status?: 'draft' | 'active' | 'closed'
          platform_post_ids?: Json
          created_at?: string
          updated_at?: string
        }
      }
      applicants: {
        Row: {
          id: string
          posting_id: string
          name: string
          apply_platform: 'jobkorea' | 'saramin' | 'wanted' | 'jumpit' | 'direct' | null
          total_score: number | null
          skill_score: number | null
          culture_score: number | null
          career_score: number | null
          strengths: string[]
          risks: string[]
          recommended_questions: string[]
          stage: 'applied' | 'screening' | 'interview1' | 'interview2' | 'final' | 'hired' | 'rejected'
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          posting_id: string
          name: string
          apply_platform?: 'jobkorea' | 'saramin' | 'wanted' | 'jumpit' | 'direct' | null
          total_score?: number | null
          skill_score?: number | null
          culture_score?: number | null
          career_score?: number | null
          strengths?: string[]
          risks?: string[]
          recommended_questions?: string[]
          stage?: 'applied' | 'screening' | 'interview1' | 'interview2' | 'final' | 'hired' | 'rejected'
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          posting_id?: string
          name?: string
          apply_platform?: 'jobkorea' | 'saramin' | 'wanted' | 'jumpit' | 'direct' | null
          total_score?: number | null
          skill_score?: number | null
          culture_score?: number | null
          career_score?: number | null
          strengths?: string[]
          risks?: string[]
          recommended_questions?: string[]
          stage?: 'applied' | 'screening' | 'interview1' | 'interview2' | 'final' | 'hired' | 'rejected'
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_logs: {
        Row: {
          id: string
          applicant_id: string
          from_stage: string | null
          to_stage: string
          memo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          applicant_id: string
          from_stage?: string | null
          to_stage: string
          memo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          applicant_id?: string
          from_stage?: string | null
          to_stage?: string
          memo?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
