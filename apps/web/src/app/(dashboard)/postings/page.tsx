// apps/web/src/app/(dashboard)/postings/page.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChevronDown, ChevronRight, ExternalLink, Pencil, Trash2, Loader2 } from 'lucide-react'

interface PlatformPosting {
  platform: string
  label: string
  status: 'posted' | 'pending' | 'failed' | 'not_posted'
  postId?: string
  url?: string
  applicants: number
  postedAt?: string
  isOwn?: boolean
}

interface Posting {
  id: string
  title: string
  status: string
  location: string
  employment_type: string
  created_at: string
  description?: string
  requirements?: string
  tech_stack?: string[]
  salary_min?: number
  salary_max?: number
}

interface PostingWithPlatforms extends Posting {
  platforms: PlatformPosting[]
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

function getPlatformStatusBadge(status: PlatformPosting['status']) {
  switch (status) {
    case 'posted':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">게시됨</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">게시 중</Badge>
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">실패</Badge>
    case 'not_posted':
      return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">미게시</Badge>
  }
}

function getTotalApplicants(platforms: PlatformPosting[]) {
  const recruify = platforms.find(p => p.platform === 'recruify')
  return recruify?.applicants || 0
}

function getPostedCount(platforms: PlatformPosting[]) {
  return platforms.filter(p => p.status === 'posted').length
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

// Generate platform data for a posting
// External platforms are always 'not_posted' since they require Chrome extension to post
function generatePlatformsForPosting(posting: Posting): PlatformPosting[] {
  const platforms: PlatformPosting[] = [
    {
      platform: 'recruify',
      label: 'Recruify',
      status: posting.status === 'active' ? 'posted' : 'pending',
      postId: posting.id,
      applicants: 0,
      postedAt: formatDate(posting.created_at),
      isOwn: true,
    },
  ]

  // External platforms - all not_posted (requires Chrome extension)
  const externalPlatforms = [
    { platform: 'jobkorea', label: '잡코리아' },
    { platform: 'saramin', label: '사람인' },
    { platform: 'wanted', label: '원티드' },
    { platform: 'jumpit', label: '점핏' },
  ]

  externalPlatforms.forEach((ext) => {
    platforms.push({
      platform: ext.platform,
      label: ext.label,
      status: 'not_posted',
      applicants: 0,
    })
  })

  return platforms
}

function PostingRow({ posting, onDelete }: { posting: PostingWithPlatforms; onDelete: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ postingId: string; platform: string; label: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const postedCount = getPostedCount(posting.platforms)
  const totalPlatforms = posting.platforms.length
  const totalApplicants = getTotalApplicants(posting.platforms)

  const handleDelete = (postingId: string, platform: string, label: string) => {
    setDeleteTarget({ postingId, platform, label })
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/postings/${deleteTarget.postingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete posting')
      }

      onDelete(deleteTarget.postingId)
      setShowDeleteDialog(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error('Delete error:', error)
      alert('공고 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Main Row */}
      <TableRow className="hover:bg-gray-50 border-b border-gray-200">
        <TableCell>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            <span>{posting.title}</span>
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              {postedCount}/{totalPlatforms}
            </Badge>
          </button>
        </TableCell>
        <TableCell>{getStatusBadge(posting.status)}</TableCell>
        <TableCell className="text-gray-600">{posting.location || '-'}</TableCell>
        <TableCell className="text-right tabular-nums font-medium">
          {totalApplicants}
        </TableCell>
        <TableCell className="text-gray-600">{formatDate(posting.created_at)}</TableCell>
        <TableCell className="text-right">
          <Link href={`/postings/${posting.id}`}>
            <Button variant="ghost" size="sm">
              상세
            </Button>
          </Link>
        </TableCell>
      </TableRow>

      {/* Platform Rows (Expanded) */}
      {isOpen && posting.platforms.map((platform, index) => (
        <TableRow
          key={platform.platform}
          className={`bg-gray-50 hover:bg-gray-100 ${index === posting.platforms.length - 1 ? 'border-b-2 border-gray-300' : ''}`}
        >
          <TableCell className="pl-12">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{platform.label}</span>
              {platform.url && (
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </TableCell>
          <TableCell>
            {getPlatformStatusBadge(platform.status)}
          </TableCell>
          <TableCell className="text-gray-500">
            {platform.status === 'posted' ? posting.location || '-' : '-'}
          </TableCell>
          <TableCell className="text-right tabular-nums text-gray-600">
            {platform.status === 'posted' ? platform.applicants : '-'}
          </TableCell>
          <TableCell className="text-gray-500">
            {platform.postedAt || '-'}
          </TableCell>
          <TableCell className="text-right">
            {platform.isOwn ? (
              <div className="flex items-center justify-end gap-1">
                <Link href={`/postings/${posting.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50"
                  onClick={() => handleDelete(posting.id, platform.platform, platform.label)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : platform.status === 'posted' ? (
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="text-xs">
                  보기
                </Button>
              </a>
            ) : platform.status === 'failed' ? (
              <Button variant="ghost" size="sm" className="text-xs text-orange-600">
                재시도
              </Button>
            ) : platform.status === 'not_posted' ? (
              <Button variant="ghost" size="sm" className="text-xs">
                게시
              </Button>
            ) : (
              <span className="text-xs text-gray-400">대기중</span>
            )}
          </TableCell>
        </TableRow>
      ))}

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공고 삭제</DialogTitle>
            <DialogDescription>
              {deleteTarget?.label}에서 &quot;{posting.title}&quot; 공고를 삭제하시겠습니까?
              {deleteTarget?.platform === 'recruify' && (
                <span className="block mt-2 text-red-600">
                  Recruify 공고를 삭제하면 연동된 모든 플랫폼의 공고 정보도 함께 삭제됩니다.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function PostingsPage() {
  const router = useRouter()
  const [postings, setPostings] = useState<PostingWithPlatforms[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPostings() {
      try {
        const response = await fetch('/api/postings')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch postings')
        }

        // Add platform data to each posting
        const postingsWithPlatforms: PostingWithPlatforms[] = (result.data || []).map((posting: Posting) => ({
          ...posting,
          platforms: generatePlatformsForPosting(posting),
        }))

        setPostings(postingsWithPlatforms)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : '공고를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostings()
  }, [])

  const handleDelete = (postingId: string) => {
    setPostings(prev => prev.filter(p => p.id !== postingId))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">채용공고</h1>
            <p className="mt-1 text-sm text-gray-600">
              채용공고를 관리하고 플랫폼별 게시 현황을 확인하세요
            </p>
          </div>
          <Link href="/postings/new">
            <Button className="bg-gray-900 hover:bg-gray-800">
              새 공고 작성
            </Button>
          </Link>
        </div>
        <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">채용공고</h1>
          <p className="mt-1 text-sm text-gray-600">
            채용공고를 관리하고 플랫폼별 게시 현황을 확인하세요
          </p>
        </div>
        <Link href="/postings/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            새 공고 작성
          </Button>
        </Link>
      </div>

      {/* Postings Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {postings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">채용공고가 없습니다</h3>
            <p className="text-sm text-gray-500 mb-4">첫 번째 채용공고를 작성해보세요</p>
            <Link href="/postings/new">
              <Button className="bg-gray-900 hover:bg-gray-800">
                새 공고 작성
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">공고 제목</TableHead>
                <TableHead className="font-semibold text-gray-900">상태</TableHead>
                <TableHead className="font-semibold text-gray-900">근무지</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">지원자</TableHead>
                <TableHead className="font-semibold text-gray-900">등록일</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postings.map((posting) => (
                <PostingRow key={posting.id} posting={posting} onDelete={handleDelete} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
