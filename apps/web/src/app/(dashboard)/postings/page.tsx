// apps/web/src/app/(dashboard)/postings/page.tsx

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

// Placeholder data
const postings = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    status: 'active',
    applicants: 45,
    location: 'Seoul',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Backend Developer',
    status: 'active',
    applicants: 38,
    location: 'Seoul',
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    title: 'Product Designer',
    status: 'active',
    applicants: 22,
    location: 'Remote',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    status: 'draft',
    applicants: 0,
    location: 'Seoul',
    createdAt: '2024-01-22',
  },
  {
    id: '5',
    title: 'Data Analyst',
    status: 'closed',
    applicants: 67,
    location: 'Busan',
    createdAt: '2024-01-10',
  },
]

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

export default function PostingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job Postings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your job listings and track applications
          </p>
        </div>
        <Link href="/postings/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            New Posting
          </Button>
        </Link>
      </div>

      {/* Postings Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Title</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Location</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Applicants</TableHead>
              <TableHead className="font-semibold text-gray-900">Created</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postings.map((posting) => (
              <TableRow key={posting.id} className="hover:bg-gray-50">
                <TableCell>
                  <Link
                    href={`/postings/${posting.id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {posting.title}
                  </Link>
                </TableCell>
                <TableCell>{getStatusBadge(posting.status)}</TableCell>
                <TableCell className="text-gray-600">{posting.location}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {posting.applicants}
                </TableCell>
                <TableCell className="text-gray-600">{posting.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/postings/${posting.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
