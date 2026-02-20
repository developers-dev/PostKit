// apps/web/src/app/(dashboard)/postings/new/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostingForm } from './posting-form'

export default function NewPostingPage() {
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
            <span>New</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Job Posting
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill in the details to create a new job posting
          </p>
        </div>
        <Link href="/postings">
          <Button variant="outline" className="border-gray-300">
            Cancel
          </Button>
        </Link>
      </div>

      {/* Form */}
      <PostingForm />
    </div>
  )
}
