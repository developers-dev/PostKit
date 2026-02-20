// apps/web/src/app/(dashboard)/postings/new/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostingForm } from './posting-form'
import { Chrome, ExternalLink } from 'lucide-react'

export default function NewPostingPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/postings" className="hover:text-gray-900">
              채용공고
            </Link>
            <span>/</span>
            <span>새 공고</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            채용공고 작성
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            새 채용공고의 상세 정보를 입력하세요
          </p>
        </div>
        <Link href="/postings">
          <Button variant="outline" className="border-gray-300">
            취소
          </Button>
        </Link>
      </div>

      {/* Chrome Extension Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Chrome className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">
              멀티플랫폼 동시 게시
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Recruify 크롬 익스텐션을 설치하면 작성한 채용공고를 잡코리아, 사람인, 원티드, 점핏 등
              여러 채용 플랫폼에 한 번에 게시할 수 있습니다.
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

      {/* Form */}
      <PostingForm />
    </div>
  )
}
