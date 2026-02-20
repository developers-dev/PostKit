// apps/web/src/app/(dashboard)/postings/[id]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PostingActions } from './posting-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPosting(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ')

  try {
    const response = await fetch(`${baseUrl}/api/postings/${id}`, {
      cache: 'no-store',
      headers: {
        Cookie: cookieHeader,
      },
    })

    if (!response.ok) {
      return null
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Failed to fetch posting:', error)
    return null
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">진행중</Badge>
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">임시저장</Badge>
    case 'closed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">마감</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return '미정'

  const format = (n: number) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(n)

  if (min && max) return `${format(min)} - ${format(max)}`
  if (min) return `${format(min)} 이상`
  if (max) return `${format(max)} 이하`
  return '미정'
}

export default async function PostingDetailPage({ params }: PageProps) {
  const { id } = await params
  const posting = await getPosting(id)

  if (!posting) {
    notFound()
  }

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
            <span>{posting.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {posting.title}
            </h1>
            {getStatusBadge(posting.status)}
          </div>
          <p className="mt-1 text-sm text-gray-600">
            등록일: {new Date(posting.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PostingActions postingId={id} currentStatus={posting.status} />
          <Link href={`/postings/${id}/edit`}>
            <Button variant="outline" className="border-gray-300">
              수정
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                채용공고 내용
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {posting.description || '내용이 없습니다.'}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                자격 요건
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {posting.requirements || '자격 요건이 없습니다.'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                상세 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">근무지</p>
                <p className="text-sm font-medium text-gray-900">
                  {posting.location || '미정'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">고용 형태</p>
                <p className="text-sm font-medium text-gray-900">
                  {posting.employment_type === 'full-time' ? '정규직' :
                   posting.employment_type === 'part-time' ? '파트타임' :
                   posting.employment_type === 'contract' ? '계약직' :
                   posting.employment_type === 'internship' ? '인턴' : '미정'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">연봉 범위</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatSalary(posting.salary_min, posting.salary_max)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          {posting.tech_stack && posting.tech_stack.length > 0 && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  기술 스택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {posting.tech_stack.map((tech: string) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="border-gray-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                빠른 실행
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/applicants?posting=${id}`} className="block">
                <Button variant="outline" className="w-full border-gray-300">
                  지원자 보기
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-gray-300">
                링크 복사
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
