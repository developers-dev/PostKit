// apps/web/src/app/(dashboard)/applicants/pipeline/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PipelineBoard } from './pipeline-board'
import { List } from 'lucide-react'

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/applicants" className="hover:text-gray-900">
              지원자
            </Link>
            <span>/</span>
            <span>파이프라인</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            채용 파이프라인
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            지원자를 드래그하여 채용 단계를 변경하세요
          </p>
        </div>
        <Link href="/applicants">
          <Button variant="outline" className="gap-2">
            <List className="h-4 w-4" />
            기본모드 보기
          </Button>
        </Link>
      </div>

      {/* Pipeline Board */}
      <PipelineBoard />
    </div>
  )
}
