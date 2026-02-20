// apps/web/src/app/(dashboard)/postings/[id]/edit/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { EditPostingForm } from './edit-form'

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

export default async function EditPostingPage({ params }: PageProps) {
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
            <Link href={`/postings/${id}`} className="hover:text-gray-900">
              {posting.title}
            </Link>
            <span>/</span>
            <span>수정</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            채용공고 수정
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            채용공고 정보를 수정하세요
          </p>
        </div>
        <Link href={`/postings/${id}`}>
          <Button variant="outline" className="border-gray-300">
            취소
          </Button>
        </Link>
      </div>

      {/* Form */}
      <EditPostingForm posting={posting} />
    </div>
  )
}
