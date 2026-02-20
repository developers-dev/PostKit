// apps/web/src/app/(dashboard)/applicants/pipeline/pipeline-board.tsx

'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { PipelineColumn } from './pipeline-column'
import { ApplicantCard } from './applicant-card'

export interface Applicant {
  id: string
  name: string
  position: string
  score: number
  platform: string
  appliedAt: string
}

export type Stage =
  | 'applied'
  | 'screening'
  | 'interview1'
  | 'interview2'
  | 'final'
  | 'hired'
  | 'rejected'

const STAGES: { id: Stage; title: string; color: string }[] = [
  { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
  { id: 'screening', title: 'Screening', color: 'bg-yellow-500' },
  { id: 'interview1', title: 'Interview 1', color: 'bg-purple-500' },
  { id: 'interview2', title: 'Interview 2', color: 'bg-purple-600' },
  { id: 'final', title: 'Final', color: 'bg-indigo-500' },
  { id: 'hired', title: 'Hired', color: 'bg-green-500' },
  { id: 'rejected', title: 'Rejected', color: 'bg-gray-400' },
]

// Mock data
const INITIAL_APPLICANTS: Record<Stage, Applicant[]> = {
  applied: [
    {
      id: '1',
      name: 'Park Jihoon',
      position: 'Product Designer',
      score: 85,
      platform: 'jobkorea',
      appliedAt: '2024-01-22',
    },
    {
      id: '2',
      name: 'Choi Yuna',
      position: 'Frontend Developer',
      score: 79,
      platform: 'direct',
      appliedAt: '2024-01-22',
    },
    {
      id: '3',
      name: 'Han Minji',
      position: 'Backend Developer',
      score: 82,
      platform: 'wanted',
      appliedAt: '2024-01-23',
    },
  ],
  screening: [
    {
      id: '4',
      name: 'Lee Soyeon',
      position: 'Backend Developer',
      score: 88,
      platform: 'saramin',
      appliedAt: '2024-01-21',
    },
    {
      id: '5',
      name: 'Kang Dohyun',
      position: 'Frontend Developer',
      score: 84,
      platform: 'wanted',
      appliedAt: '2024-01-20',
    },
  ],
  interview1: [
    {
      id: '6',
      name: 'Kim Minjun',
      position: 'Frontend Developer',
      score: 92,
      platform: 'wanted',
      appliedAt: '2024-01-20',
    },
  ],
  interview2: [
    {
      id: '7',
      name: 'Yoon Seoha',
      position: 'Product Designer',
      score: 90,
      platform: 'saramin',
      appliedAt: '2024-01-18',
    },
  ],
  final: [
    {
      id: '8',
      name: 'Jang Hyunwoo',
      position: 'Backend Developer',
      score: 94,
      platform: 'direct',
      appliedAt: '2024-01-15',
    },
  ],
  hired: [
    {
      id: '9',
      name: 'Shin Yeji',
      position: 'Frontend Developer',
      score: 91,
      platform: 'wanted',
      appliedAt: '2024-01-10',
    },
  ],
  rejected: [
    {
      id: '10',
      name: 'Jung Seojin',
      position: 'Backend Developer',
      score: 65,
      platform: 'wanted',
      appliedAt: '2024-01-19',
    },
  ],
}

export function PipelineBoard() {
  const [applicants, setApplicants] =
    useState<Record<Stage, Applicant[]>>(INITIAL_APPLICANTS)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findApplicant = (id: string): Applicant | undefined => {
    for (const stage of Object.keys(applicants) as Stage[]) {
      const found = applicants[stage].find((a) => a.id === id)
      if (found) return found
    }
    return undefined
  }

  const findStage = (id: string): Stage | undefined => {
    for (const stage of Object.keys(applicants) as Stage[]) {
      if (applicants[stage].find((a) => a.id === id)) return stage
    }
    return undefined
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return

    const activeApplicantId = active.id as string
    const overContainerId = over.id as Stage

    // Check if dropping on a column
    if (STAGES.find((s) => s.id === overContainerId)) {
      const sourceStage = findStage(activeApplicantId)

      if (sourceStage && sourceStage !== overContainerId) {
        setApplicants((prev) => {
          const applicant = prev[sourceStage].find(
            (a) => a.id === activeApplicantId
          )
          if (!applicant) return prev

          return {
            ...prev,
            [sourceStage]: prev[sourceStage].filter(
              (a) => a.id !== activeApplicantId
            ),
            [overContainerId]: [...prev[overContainerId], applicant],
          }
        })
      }
    }
  }

  const activeApplicant = activeId ? findApplicant(activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <PipelineColumn
            key={stage.id}
            id={stage.id}
            title={stage.title}
            color={stage.color}
            applicants={applicants[stage.id]}
            count={applicants[stage.id].length}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplicant ? (
          <ApplicantCard applicant={activeApplicant} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
