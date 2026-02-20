// apps/web/src/app/(dashboard)/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Posting {
  id: string
  title: string
  status: string
  location: string
  created_at: string
}

interface Applicant {
  id: string
  name: string
  position: string
  postingId: string
  score: number
  stage: string
  appliedAt: string
}

const stageLabels: Record<string, string> = {
  applied: '지원 완료',
  screening: '서류 검토',
  interview1: '1차 면접',
  interview2: '2차 면접',
  final: '최종',
  hired: '합격',
  rejected: '불합격',
}

// Generate mock applicants based on real postings
function generateMockApplicants(postings: Posting[]): Applicant[] {
  if (postings.length === 0) return []

  const names = ['김민준', '이소연', '박지훈', '최유나', '정서진', '한승우', '윤지현', '강도현', '임수빈', '오태민']
  const stages = ['applied', 'screening', 'interview1', 'interview2', 'final', 'hired', 'rejected']

  const applicants: Applicant[] = []
  let id = 1

  postings.forEach((posting) => {
    const count = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < count; i++) {
      const nameIndex = (id - 1) % names.length
      applicants.push({
        id: String(id),
        name: names[nameIndex],
        position: posting.title,
        postingId: posting.id,
        score: Math.floor(Math.random() * 25) + 70,
        stage: stages[Math.floor(Math.random() * stages.length)],
        appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      id++
    }
  })

  return applicants.sort((a, b) => b.score - a.score)
}

function getDaysActive(createdAt: string): number {
  const created = new Date(createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - created.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function DashboardPage() {
  const [postings, setPostings] = useState<Posting[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/postings')
        const result = await response.json()

        if (response.ok && result.data) {
          setPostings(result.data)
          setApplicants(generateMockApplicants(result.data))
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate stats
  const activePostings = postings.filter(p => p.status === 'active')
  const totalApplicants = applicants.length
  const inReview = applicants.filter(a => a.stage === 'screening').length
  const hiredThisMonth = applicants.filter(a => a.stage === 'hired').length

  const stats = [
    { name: '진행중 공고', value: String(activePostings.length), change: `전체 ${postings.length}건` },
    { name: '전체 지원자', value: String(totalApplicants), change: '모든 공고 합산' },
    { name: '서류 검토중', value: String(inReview), change: `${applicants.filter(a => a.stage === 'applied').length}명 대기중` },
    { name: '채용 완료', value: String(hiredThisMonth), change: `최종 ${applicants.filter(a => a.stage === 'final').length}명` },
  ]

  // Recent applicants (top 4)
  const recentApplicants = applicants.slice(0, 4)

  // Active postings with applicant count
  const postingsWithStats = postings
    .filter(p => p.status === 'active')
    .slice(0, 3)
    .map(posting => ({
      ...posting,
      applicantCount: applicants.filter(a => a.postingId === posting.id).length,
      daysActive: getDaysActive(posting.created_at),
    }))

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
          <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
          <p className="mt-1 text-sm text-gray-600">
            채용 파이프라인 현황을 한눈에 확인하세요
          </p>
        </div>
        <Link href="/postings/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            새 공고 작성
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applicants */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              최근 지원자
            </CardTitle>
            <Link
              href="/applicants"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              전체 보기
            </Link>
          </CardHeader>
          <CardContent>
            {recentApplicants.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                지원자가 없습니다
              </p>
            ) : (
              <div className="space-y-4">
                {recentApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {applicant.name}
                      </p>
                      <p className="text-xs text-gray-500">{applicant.position}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {applicant.score}
                        </p>
                        <p className="text-xs text-gray-500">점수</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {stageLabels[applicant.stage] || applicant.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Postings */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              진행중 공고
            </CardTitle>
            <Link
              href="/postings"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              전체 보기
            </Link>
          </CardHeader>
          <CardContent>
            {postingsWithStats.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">진행중인 공고가 없습니다</p>
                <Link href="/postings/new">
                  <Button variant="outline" size="sm">
                    새 공고 작성
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {postingsWithStats.map((posting) => (
                  <Link
                    key={posting.id}
                    href={`/postings/${posting.id}`}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {posting.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {posting.daysActive}일 경과
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {posting.applicantCount}
                      </p>
                      <p className="text-xs text-gray-500">지원자</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            빠른 실행
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/postings/new">
              <Button variant="outline" className="border-gray-300">
                채용공고 작성
              </Button>
            </Link>
            <Link href="/applicants">
              <Button variant="outline" className="border-gray-300">
                지원자 검토
              </Button>
            </Link>
            <Link href="/applicants/score">
              <Button variant="outline" className="border-gray-300">
                AI 이력서 채점
              </Button>
            </Link>
            <Link href="/applicants/pipeline">
              <Button variant="outline" className="border-gray-300">
                파이프라인 보기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
