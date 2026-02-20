// apps/web/src/app/(dashboard)/applicants/pipeline/applicant-card.tsx

'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import type { Applicant } from './pipeline-board'

interface ApplicantCardProps {
  applicant: Applicant
  isDragging?: boolean
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-gray-600'
}

function getPlatformLabel(platform: string) {
  const labels: Record<string, string> = {
    jobkorea: '잡코리아',
    saramin: '사람인',
    wanted: '원티드',
    jumpit: '점핏',
    direct: '직접 지원',
  }
  return labels[platform] || platform
}

export function ApplicantCard({ applicant, isDragging }: ApplicantCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: applicant.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing',
        'hover:border-gray-300 hover:shadow-sm transition-all',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg rotate-2'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{applicant.name}</h4>
          <p className="text-sm text-gray-600 truncate">{applicant.position}</p>
        </div>
        <div
          className={cn(
            'flex-shrink-0 text-sm font-semibold tabular-nums',
            getScoreColor(applicant.score)
          )}
        >
          {applicant.score}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{getPlatformLabel(applicant.platform)}</span>
        <span>{applicant.appliedAt}</span>
      </div>

      {/* Resume Link */}
      {applicant.resumeUrl && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <a
            href={applicant.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <ExternalLink className="h-3 w-3" />
            이력서 보기
          </a>
        </div>
      )}
    </div>
  )
}
