// apps/web/src/app/(dashboard)/applicants/score/page.tsx

import Link from 'next/link'
import { ResumeScorer } from './resume-scorer'

export default function ScoreResumePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/applicants" className="hover:text-gray-900">
            Applicants
          </Link>
          <span>/</span>
          <span>AI Resume Scoring</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          AI Resume Scoring
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload a resume and job description to get an AI-powered evaluation
        </p>
      </div>

      {/* Scorer Component */}
      <ResumeScorer />
    </div>
  )
}
