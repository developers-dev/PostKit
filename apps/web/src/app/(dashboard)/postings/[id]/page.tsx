// apps/web/src/app/(dashboard)/postings/[id]/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
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

  try {
    const response = await fetch(`${baseUrl}/api/postings/${id}`, {
      cache: 'no-store',
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
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>
    case 'closed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Closed</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return 'Not specified'

  const format = (n: number) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(n)

  if (min && max) return `${format(min)} - ${format(max)}`
  if (min) return `From ${format(min)}`
  if (max) return `Up to ${format(max)}`
  return 'Not specified'
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
              Job Postings
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
            Created on {new Date(posting.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PostingActions postingId={id} currentStatus={posting.status} />
          <Link href={`/postings/${id}/edit`}>
            <Button variant="outline" className="border-gray-300">
              Edit
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
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {posting.description || 'No description provided.'}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                {posting.requirements || 'No requirements specified.'}
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
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {posting.location || 'Not specified'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Employment Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {posting.employment_type?.replace('-', ' ') || 'Not specified'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Salary Range</p>
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
                  Tech Stack
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
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/applicants?posting=${id}`} className="block">
                <Button variant="outline" className="w-full border-gray-300">
                  View Applicants
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-gray-300">
                Copy Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
