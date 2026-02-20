// apps/web/src/app/(dashboard)/applicants/page.tsx

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

// Placeholder data
const applicants = [
  {
    id: '1',
    name: 'Kim Minjun',
    position: 'Senior Frontend Developer',
    score: 92,
    stage: 'interview1',
    platform: 'wanted',
    appliedAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Lee Soyeon',
    position: 'Backend Developer',
    score: 88,
    stage: 'screening',
    platform: 'saramin',
    appliedAt: '2024-01-21',
  },
  {
    id: '3',
    name: 'Park Jihoon',
    position: 'Product Designer',
    score: 85,
    stage: 'applied',
    platform: 'jobkorea',
    appliedAt: '2024-01-22',
  },
  {
    id: '4',
    name: 'Choi Yuna',
    position: 'Senior Frontend Developer',
    score: 79,
    stage: 'applied',
    platform: 'direct',
    appliedAt: '2024-01-22',
  },
  {
    id: '5',
    name: 'Jung Seojin',
    position: 'Backend Developer',
    score: 76,
    stage: 'rejected',
    platform: 'wanted',
    appliedAt: '2024-01-19',
  },
]

function getStageBadge(stage: string) {
  const stageConfig: Record<string, { label: string; className: string }> = {
    applied: { label: 'Applied', className: 'bg-blue-100 text-blue-800' },
    screening: { label: 'Screening', className: 'bg-yellow-100 text-yellow-800' },
    interview1: { label: 'Interview 1', className: 'bg-purple-100 text-purple-800' },
    interview2: { label: 'Interview 2', className: 'bg-purple-100 text-purple-800' },
    final: { label: 'Final', className: 'bg-indigo-100 text-indigo-800' },
    hired: { label: 'Hired', className: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', className: 'bg-gray-100 text-gray-800' },
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

export default function ApplicantsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Applicants</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review and manage candidates across all positions
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/applicants/pipeline">
            <Button variant="outline">
              Pipeline View
            </Button>
          </Link>
          <Link href="/applicants/score">
            <Button className="bg-gray-900 hover:bg-gray-800">
              AI Resume Scoring
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="frontend">Frontend Developer</SelectItem>
            <SelectItem value="backend">Backend Developer</SelectItem>
            <SelectItem value="designer">Product Designer</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="interview1">Interview 1</SelectItem>
            <SelectItem value="interview2">Interview 2</SelectItem>
            <SelectItem value="final">Final</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applicants Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Position</TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">Score</TableHead>
              <TableHead className="font-semibold text-gray-900">Stage</TableHead>
              <TableHead className="font-semibold text-gray-900">Source</TableHead>
              <TableHead className="font-semibold text-gray-900">Applied</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.id} className="hover:bg-gray-50 cursor-pointer">
                <TableCell>
                  <span className="font-medium text-gray-900">
                    {applicant.name}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{applicant.position}</TableCell>
                <TableCell className="text-center">
                  <span className={`font-semibold tabular-nums ${getScoreColor(applicant.score)}`}>
                    {applicant.score}
                  </span>
                </TableCell>
                <TableCell>{getStageBadge(applicant.stage)}</TableCell>
                <TableCell className="text-gray-600 capitalize">
                  {applicant.platform}
                </TableCell>
                <TableCell className="text-gray-600">{applicant.appliedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
