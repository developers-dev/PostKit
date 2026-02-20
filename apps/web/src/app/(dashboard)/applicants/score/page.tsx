// apps/web/src/app/(dashboard)/applicants/score/page.tsx

import Link from 'next/link'
import { ResumeScorer } from './resume-scorer'
import { Chrome, ExternalLink } from 'lucide-react'

export default function ScoreResumePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/applicants" className="hover:text-gray-900">
            지원자
          </Link>
          <span>/</span>
          <span>AI 이력서 채점</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          AI 이력서 채점
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          이력서와 채용공고를 업로드하면 AI가 자동으로 평가합니다
        </p>
      </div>

      {/* Chrome Extension Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Chrome className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">
              타 플랫폼 이력서 채점
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              잡코리아, 사람인, 원티드, 점핏 등 채용 플랫폼에서 직접 이력서를 채점하려면
              Recruify 크롬 익스텐션을 설치하세요. 플랫폼 페이지에서 바로 AI 채점 결과를 확인할 수 있습니다.
            </p>
            <Link
              href="/extension"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              크롬 익스텐션 설치하기
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scorer Component */}
      <ResumeScorer />
    </div>
  )
}
