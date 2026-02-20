// apps/web/src/app/(dashboard)/applicants/pipeline/page.tsx

import Link from 'next/link'
import { PipelineBoard } from './pipeline-board'

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/applicants" className="hover:text-gray-900">
              Applicants
            </Link>
            <span>/</span>
            <span>Pipeline</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hiring Pipeline
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop candidates between stages to update their status
          </p>
        </div>
      </div>

      {/* Pipeline Board */}
      <PipelineBoard />
    </div>
  )
}
