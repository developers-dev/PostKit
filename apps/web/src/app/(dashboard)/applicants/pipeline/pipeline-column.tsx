// apps/web/src/app/(dashboard)/applicants/pipeline/pipeline-column.tsx

'use client'

import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { ApplicantCard } from './applicant-card'
import type { Applicant, Stage } from './pipeline-board'

interface PipelineColumnProps {
  id: Stage
  title: string
  color: string
  applicants: Applicant[]
  count: number
}

export function PipelineColumn({
  id,
  title,
  color,
  applicants,
  count,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="flex-shrink-0 w-72">
      <div className="bg-gray-50 rounded-lg border border-gray-200">
        {/* Column Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', color)} />
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className="ml-auto text-sm text-gray-500 tabular-nums">
              {count}
            </span>
          </div>
        </div>

        {/* Column Content */}
        <div
          ref={setNodeRef}
          className={cn(
            'p-2 min-h-[400px] transition-colors',
            isOver && 'bg-blue-50'
          )}
        >
          <SortableContext
            items={applicants.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {applicants.map((applicant) => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))}
            </div>
          </SortableContext>

          {applicants.length === 0 && (
            <div className="flex items-center justify-center h-20 text-sm text-gray-400">
              Drop candidates here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
