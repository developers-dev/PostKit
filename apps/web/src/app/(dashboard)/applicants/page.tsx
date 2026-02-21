// apps/web/src/app/(dashboard)/applicants/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Loader2, Info, ExternalLink, HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Posting {
  id: string
  title: string
  status: string
  location: string
  created_at: string
}

interface AIAnalysis {
  skillScore: number
  cultureScore: number
  careerScore: number
  strengths: string[]
  risks: string[]
  recommendedQuestions: string[]
  summary: string
}

interface Applicant {
  id: string
  name: string
  postingId: string
  postingTitle: string
  score: number
  stage: string
  platform: string
  appliedAt: string
  resumeUrl?: string
  resumeTitle?: string
  aiAnalysis: AIAnalysis
}

// Generate mock applicants for real postings
function generateMockApplicants(postings: Posting[]): Applicant[] {
  if (postings.length === 0) return []

  const names = ['김민준', '이소연', '박지훈', '최유나', '정서진', '한승우', '윤지현', '강도현', '임수빈', '오태민']
  const stages = ['applied', 'screening', 'interview1', 'interview2', 'final', 'hired', 'rejected']
  const platforms = ['jobkorea', 'saramin', 'wanted', 'jumpit', 'direct']

  // Platform base URLs for resumes
  const platformResumeUrls: Record<string, string> = {
    jobkorea: 'https://www.jobkorea.co.kr/Resume/View/',
    saramin: 'https://www.saramin.co.kr/zf_user/resume/',
    wanted: 'https://www.wanted.co.kr/cv/',
    jumpit: 'https://www.jumpit.co.kr/resume/',
  }

  // Mock AI analysis data
  const strengthsPool = [
    '관련 기술 스택에 대한 풍부한 경험',
    '대규모 프로젝트 리딩 경험 보유',
    '문제 해결 능력이 뛰어남',
    '커뮤니케이션 스킬 우수',
    '빠른 학습 능력',
    '애자일 방법론 경험',
    '코드 품질에 대한 높은 이해도',
    '팀 협업 경험 다수',
  ]

  const risksPool = [
    '일부 요구 기술에 대한 경험 부족',
    '대기업 환경 경험 없음',
    '리더십 경험 제한적',
    '영어 커뮤니케이션 능력 확인 필요',
    '이직 주기가 짧은 편',
    '원격 근무 경험 부족',
  ]

  const questionsPool = [
    '가장 도전적이었던 프로젝트에 대해 설명해주세요.',
    '팀 내 갈등을 해결한 경험이 있으신가요?',
    '새로운 기술을 학습하는 방식에 대해 말씀해주세요.',
    '본인의 가장 큰 기술적 성장 경험은 무엇인가요?',
    '협업 시 가장 중요하게 생각하는 점은 무엇인가요?',
    '실패했던 경험과 그로부터 배운 점을 공유해주세요.',
    '5년 후 커리어 목표에 대해 말씀해주세요.',
  ]

  const applicants: Applicant[] = []
  let id = 1

  // Generate 2-4 applicants per posting
  postings.forEach((posting) => {
    const count = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < count; i++) {
      const nameIndex = (id - 1) % names.length
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      const name = names[nameIndex]

      // Generate resume URL for external platforms
      const resumeId = Math.random().toString(36).substring(2, 10)
      const resumeUrl = platform !== 'direct' && platformResumeUrls[platform]
        ? `${platformResumeUrls[platform]}${resumeId}`
        : undefined

      // Generate AI analysis scores
      const skillScore = Math.floor(Math.random() * 25) + 70
      const cultureScore = Math.floor(Math.random() * 25) + 70
      const careerScore = Math.floor(Math.random() * 25) + 70
      const totalScore = Math.round((skillScore + cultureScore + careerScore) / 3)

      // Random selection of strengths, risks, questions
      const shuffledStrengths = [...strengthsPool].sort(() => Math.random() - 0.5)
      const shuffledRisks = [...risksPool].sort(() => Math.random() - 0.5)
      const shuffledQuestions = [...questionsPool].sort(() => Math.random() - 0.5)

      applicants.push({
        id: String(id),
        name: name,
        postingId: posting.id,
        postingTitle: posting.title,
        score: totalScore,
        stage: stages[Math.floor(Math.random() * stages.length)],
        platform: platform,
        appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        resumeUrl: resumeUrl,
        resumeTitle: resumeUrl ? `${name} 이력서` : undefined,
        aiAnalysis: {
          skillScore,
          cultureScore,
          careerScore,
          strengths: shuffledStrengths.slice(0, 3),
          risks: shuffledRisks.slice(0, 2),
          recommendedQuestions: shuffledQuestions.slice(0, 3),
          summary: `${name} 지원자는 ${posting.title} 포지션에 적합한 기술 역량을 보유하고 있으며, 전반적으로 긍정적인 평가를 받았습니다. 면접을 통해 실무 역량을 추가로 검증하는 것을 권장합니다.`,
        },
      })
      id++
    }
  })

  return applicants.sort((a, b) => b.score - a.score)
}

function getStageBadge(stage: string) {
  const stageConfig: Record<string, { label: string; className: string }> = {
    applied: { label: '지원 완료', className: 'bg-blue-100 text-blue-800' },
    screening: { label: '서류 검토', className: 'bg-yellow-100 text-yellow-800' },
    interview1: { label: '1차 면접', className: 'bg-purple-100 text-purple-800' },
    interview2: { label: '2차 면접', className: 'bg-purple-100 text-purple-800' },
    final: { label: '최종', className: 'bg-indigo-100 text-indigo-800' },
    hired: { label: '합격', className: 'bg-green-100 text-green-800' },
    rejected: { label: '불합격', className: 'bg-gray-100 text-gray-800' },
  }

  const config = stageConfig[stage] || { label: stage, className: 'bg-gray-100 text-gray-800' }

  return (
    <Badge className={`${config.className} hover:${config.className}`}>
      {config.label}
    </Badge>
  )
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

export default function ApplicantsPage() {
  const searchParams = useSearchParams()
  const postingIdFromUrl = searchParams.get('posting')

  const [postings, setPostings] = useState<Posting[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPosting, setSelectedPosting] = useState<string>(postingIdFromUrl || 'all')
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  // Update filter when URL changes
  useEffect(() => {
    if (postingIdFromUrl) {
      setSelectedPosting(postingIdFromUrl)
    }
  }, [postingIdFromUrl])

  useEffect(() => {
    async function fetchPostings() {
      try {
        const response = await fetch('/api/postings')
        const result = await response.json()

        if (response.ok && result.data) {
          setPostings(result.data)
          // Generate mock applicants based on real postings
          setApplicants(generateMockApplicants(result.data))
        }
      } catch (error) {
        console.error('Failed to fetch postings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostings()
  }, [])

  // Handle stage change
  const handleStageChange = (applicantId: string, newStage: string) => {
    setApplicants(prev => prev.map(a =>
      a.id === applicantId ? { ...a, stage: newStage } : a
    ))
    // Update selected applicant if it's the one being changed
    if (selectedApplicant?.id === applicantId) {
      setSelectedApplicant(prev => prev ? { ...prev, stage: newStage } : null)
    }
  }

  // Filter applicants based on selected filters
  const filteredApplicants = applicants.filter((applicant) => {
    if (selectedPosting !== 'all' && applicant.postingId !== selectedPosting) {
      return false
    }
    if (selectedStage !== 'all' && applicant.stage !== selectedStage) {
      return false
    }
    return true
  })

  // Group applicants by posting for summary
  const applicantsByPosting = applicants.reduce((acc, applicant) => {
    if (!acc[applicant.postingId]) {
      acc[applicant.postingId] = {
        title: applicant.postingTitle,
        count: 0,
      }
    }
    acc[applicant.postingId].count++
    return acc
  }, {} as Record<string, { title: string; count: number }>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">지원자</h1>
          <p className="mt-1 text-sm text-gray-600">
            전체 포지션의 지원자를 검토하고 관리하세요
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/applicants/pipeline">
            <Button variant="outline">
              파이프라인 보기
            </Button>
          </Link>
          <Link href="/applicants/score">
            <Button className="bg-gray-900 hover:bg-gray-800">
              AI 이력서 채점
            </Button>
          </Link>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p>
              타 플랫폼(잡코리아, 사람인, 원티드, 점핏)의 이력서 원문은 수집되지 않습니다.
              <span className="font-medium text-gray-900"> 크롬 익스텐션</span>을 통해 분석한 AI 채점 결과만 표시됩니다.
            </p>
          </div>
        </div>
      </div>

      {postings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">채용공고가 없습니다</h3>
          <p className="text-sm text-gray-500 mb-4">먼저 채용공고를 등록하면 지원자를 관리할 수 있습니다</p>
          <Link href="/postings/new">
            <Button className="bg-gray-900 hover:bg-gray-800">
              새 공고 작성
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(applicantsByPosting).map(([postingId, data]) => (
              <button
                key={postingId}
                onClick={() => setSelectedPosting(selectedPosting === postingId ? 'all' : postingId)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  selectedPosting === postingId
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{data.count}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{data.title}</p>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedPosting} onValueChange={setSelectedPosting}>
              <SelectTrigger className="w-[250px]">
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

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="단계" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 단계</SelectItem>
                <SelectItem value="applied">지원 완료</SelectItem>
                <SelectItem value="screening">서류 검토</SelectItem>
                <SelectItem value="interview1">1차 면접</SelectItem>
                <SelectItem value="interview2">2차 면접</SelectItem>
                <SelectItem value="final">최종</SelectItem>
                <SelectItem value="hired">합격</SelectItem>
                <SelectItem value="rejected">불합격</SelectItem>
              </SelectContent>
            </Select>

            {(selectedPosting !== 'all' || selectedStage !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPosting('all')
                  setSelectedStage('all')
                }}
                className="text-gray-500"
              >
                필터 초기화
              </Button>
            )}
          </div>

          {/* Applicants Table */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">이름</TableHead>
                  <TableHead className="font-semibold text-gray-900">지원 공고</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">점수</TableHead>
                  <TableHead className="font-semibold text-gray-900">단계</TableHead>
                  <TableHead className="font-semibold text-gray-900">지원 경로</TableHead>
                  <TableHead className="font-semibold text-gray-900">지원일</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    <div className="inline-flex items-center gap-1">
                      이력서
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <p className="text-xs">해당 플랫폼(잡코리아, 사람인 등) 관리자 계정으로 로그인해야 이력서를 열람할 수 있습니다.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      해당 조건에 맞는 지원자가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <TableRow
                      key={applicant.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {applicant.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/postings/${applicant.postingId}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {applicant.postingTitle}
                          </Link>
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold tabular-nums ${getScoreColor(applicant.score)}`}>
                          {applicant.score}
                        </span>
                      </TableCell>
                      <TableCell>{getStageBadge(applicant.stage)}</TableCell>
                      <TableCell className="text-gray-600">
                        {getPlatformLabel(applicant.platform)}
                      </TableCell>
                      <TableCell className="text-gray-600">{applicant.appliedAt}</TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        {applicant.resumeUrl ? (
                          <a
                            href={applicant.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            보기
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500">
            총 {filteredApplicants.length}명의 지원자
            {selectedPosting !== 'all' && applicantsByPosting[selectedPosting] &&
              ` (${applicantsByPosting[selectedPosting].title})`
            }
          </p>
        </>
      )}

      {/* AI Analysis Modal */}
      <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
        <DialogContent className="max-w-xl">
          {selectedApplicant && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedApplicant.name}</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedApplicant.postingTitle} · {getPlatformLabel(selectedApplicant.platform)}
                    </p>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedApplicant.score)}`}>
                    {selectedApplicant.score}점
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-6 max-h-[65vh] overflow-y-auto pr-1">
                {/* Score Breakdown - 3 columns */}
                <div className="flex gap-4">
                  <div className="flex-1 text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedApplicant.aiAnalysis.skillScore}</div>
                    <div className="text-sm text-blue-700 mt-1">기술 역량</div>
                  </div>
                  <div className="flex-1 text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedApplicant.aiAnalysis.cultureScore}</div>
                    <div className="text-sm text-green-700 mt-1">문화 적합</div>
                  </div>
                  <div className="flex-1 text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedApplicant.aiAnalysis.careerScore}</div>
                    <div className="text-sm text-purple-700 mt-1">성장 가능성</div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">AI 분석 요약</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedApplicant.aiAnalysis.summary}
                  </p>
                </div>

                {/* Strengths & Risks */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-3">강점</h4>
                    <ul className="space-y-2">
                      {selectedApplicant.aiAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 font-bold">+</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-3">리스크</h4>
                    <ul className="space-y-2">
                      {selectedApplicant.aiAnalysis.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-red-500 font-bold">-</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Questions */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">추천 면접 질문</h4>
                  <ul className="space-y-3">
                    {selectedApplicant.aiAnalysis.recommendedQuestions.map((question, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium text-xs">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stage Change */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">채용 단계 변경</h4>
                  <Select
                    value={selectedApplicant.stage}
                    onValueChange={(value) => handleStageChange(selectedApplicant.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">지원 완료</SelectItem>
                      <SelectItem value="screening">서류 검토</SelectItem>
                      <SelectItem value="interview1">1차 면접</SelectItem>
                      <SelectItem value="interview2">2차 면접</SelectItem>
                      <SelectItem value="final">최종</SelectItem>
                      <SelectItem value="hired">합격</SelectItem>
                      <SelectItem value="rejected">불합격</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resume Link */}
                {selectedApplicant.resumeUrl && (
                  <div className="pt-4 border-t">
                    <a
                      href={selectedApplicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {getPlatformLabel(selectedApplicant.platform)}에서 이력서 보기
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      해당 플랫폼 관리자 계정 로그인이 필요합니다
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
