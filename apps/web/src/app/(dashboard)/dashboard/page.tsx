// apps/web/src/app/(dashboard)/dashboard/page.tsx

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Placeholder data for demonstration
const stats = [
  { name: 'Active Postings', value: '12', change: '+2 this week' },
  { name: 'Total Applicants', value: '284', change: '+43 this week' },
  { name: 'In Review', value: '56', change: '23 pending' },
  { name: 'Hired This Month', value: '8', change: '+3 vs last month' },
]

const recentApplicants = [
  { id: '1', name: 'Kim Minjun', position: 'Frontend Developer', score: 92, stage: 'Interview 1' },
  { id: '2', name: 'Lee Soyeon', position: 'Backend Developer', score: 88, stage: 'Screening' },
  { id: '3', name: 'Park Jihoon', position: 'Product Designer', score: 85, stage: 'Applied' },
  { id: '4', name: 'Choi Yuna', position: 'Frontend Developer', score: 79, stage: 'Applied' },
]

const activePostings = [
  { id: '1', title: 'Senior Frontend Developer', applicants: 45, daysActive: 12 },
  { id: '2', title: 'Backend Developer', applicants: 38, daysActive: 8 },
  { id: '3', title: 'Product Designer', applicants: 22, daysActive: 5 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Overview of your recruitment pipeline
          </p>
        </div>
        <Link href="/postings/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            New Posting
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
              Recent Applicants
            </CardTitle>
            <Link
              href="/applicants"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
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
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {applicant.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Postings */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              Active Postings
            </CardTitle>
            <Link
              href="/postings"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePostings.map((posting) => (
                <div
                  key={posting.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {posting.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {posting.daysActive} days active
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {posting.applicants}
                    </p>
                    <p className="text-xs text-gray-500">Applicants</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/postings/new">
              <Button variant="outline" className="border-gray-300">
                Create Job Posting
              </Button>
            </Link>
            <Link href="/applicants">
              <Button variant="outline" className="border-gray-300">
                Review Applicants
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="border-gray-300">
                Configure Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
