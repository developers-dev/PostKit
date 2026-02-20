// apps/web/src/app/(dashboard)/applicants/pipeline/pipeline-board.tsx

'use client'

import { useState, useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface Applicant {
  id: string
  name: string
  position: string
  postingId: string
  score: number
  platform: string
  appliedAt: string
  resumeUrl?: string
}

interface Posting {
  id: string
  title: string
  status: string
  location: string
  created_at: string
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
  { id: 'applied', title: '지원 완료', color: 'bg-blue-500' },
  { id: 'screening', title: '서류 검토', color: 'bg-yellow-500' },
  { id: 'interview1', title: '1차 면접', color: 'bg-purple-500' },
  { id: 'interview2', title: '2차 면접', color: 'bg-purple-600' },
  { id: 'final', title: '최종', color: 'bg-indigo-500' },
  { id: 'hired', title: '합격', color: 'bg-green-500' },
  { id: 'rejected', title: '불합격', color: 'bg-gray-400' },
]

// Generate applicants based on real postings
function generateApplicantsFromPostings(postings: Posting[]): Record<Stage, Applicant[]> {
  const stages: Stage[] = ['applied', 'screening', 'interview1', 'interview2', 'final', 'hired', 'rejected']
  const names = ['김민준', '이소연', '박지훈', '최유나', '정서진', '한승우', '윤지현', '강도현', '임수빈', '오태민', '신예지', '장현우', '한민지', '윤서하']
  const platforms = ['jobkorea', 'saramin', 'wanted', 'jumpit', 'direct']

  // Platform base URLs for resumes
  const platformResumeUrls: Record<string, string> = {
    jobkorea: 'https://www.jobkorea.co.kr/Resume/View/',
    saramin: 'https://www.saramin.co.kr/zf_user/resume/',
    wanted: 'https://www.wanted.co.kr/cv/',
    jumpit: 'https://www.jumpit.co.kr/resume/',
  }

  const result: Record<Stage, Applicant[]> = {
    applied: [],
    screening: [],
    interview1: [],
    interview2: [],
    final: [],
    hired: [],
    rejected: [],
  }

  if (postings.length === 0) return result

  let id = 1
  postings.forEach((posting) => {
    // Generate 2-4 applicants per posting across different stages
    const count = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < count; i++) {
      const nameIndex = (id - 1) % names.length
      const stage = stages[Math.floor(Math.random() * stages.length)]
      const score = Math.floor(Math.random() * 30) + 65
      const platform = platforms[Math.floor(Math.random() * platforms.length)]

      // Generate resume URL for external platforms
      const resumeId = Math.random().toString(36).substring(2, 10)
      const resumeUrl = platform !== 'direct' && platformResumeUrls[platform]
        ? `${platformResumeUrls[platform]}${resumeId}`
        : undefined

      result[stage].push({
        id: String(id),
        name: names[nameIndex],
        position: posting.title,
        postingId: posting.id,
        score,
        platform,
        appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        resumeUrl,
      })
      id++
    }
  })

  // Sort each stage by score descending
  Object.keys(result).forEach((stage) => {
    result[stage as Stage].sort((a, b) => b.score - a.score)
  })

  return result
}

export function PipelineBoard() {
  const [applicants, setApplicants] = useState<Record<Stage, Applicant[]>>({
    applied: [],
    screening: [],
    interview1: [],
    interview2: [],
    final: [],
    hired: [],
    rejected: [],
  })
  const [postings, setPostings] = useState<Posting[]>([])
  const [selectedPosting, setSelectedPosting] = useState<string>('all')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPostings() {
      try {
        const response = await fetch('/api/postings')
        const result = await response.json()

        if (response.ok && result.data) {
          setPostings(result.data)
          const generatedApplicants = generateApplicantsFromPostings(result.data)
          setApplicants(generatedApplicants)
        }
      } catch (error) {
        console.error('Failed to fetch postings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostings()
  }, [])

  // Filter applicants by selected posting
  const filteredApplicants: Record<Stage, Applicant[]> = selectedPosting === 'all'
    ? applicants
    : Object.fromEntries(
        Object.entries(applicants).map(([stage, apps]) => [
          stage,
          apps.filter(a => a.postingId === selectedPosting)
        ])
      ) as Record<Stage, Applicant[]>

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={selectedPosting} onValueChange={setSelectedPosting}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="채용공고 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 채용공고</SelectItem>
            {postings.map((posting) => (
              <SelectItem key={posting.id} value={posting.id}>
                {posting.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPosting !== 'all' && (
          <button
            onClick={() => setSelectedPosting('all')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Pipeline Board */}
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
              applicants={filteredApplicants[stage.id]}
              count={filteredApplicants[stage.id].length}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApplicant ? (
            <ApplicantCard applicant={activeApplicant} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
