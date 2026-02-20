// apps/web/src/app/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                PostKit
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                How it works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gray-900 text-white hover:bg-gray-800">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Recruitment automation for modern HR teams
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Post job listings to multiple platforms with one click. Score resumes
              with AI-powered analysis. Manage your entire hiring pipeline in a
              single dashboard.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8"
                >
                  Start free trial
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 border-gray-300"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              Everything you need to hire faster
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Streamline your recruitment process from posting to hiring
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Multi-Platform Posting
              </h3>
              <p className="mt-2 text-gray-600">
                Write your job description once and automatically post to JobKorea,
                Saramin, Wanted, and more. Save hours of repetitive work.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                AI Resume Scoring
              </h3>
              <p className="mt-2 text-gray-600">
                GPT-4o analyzes each resume against your job requirements. Get
                scores, strengths, risks, and recommended interview questions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Pipeline Management
              </h3>
              <p className="mt-2 text-gray-600">
                Track every candidate through your hiring stages. From application
                to offer, manage your pipeline with a visual kanban board.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">How it works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center border-2 border-gray-900 text-lg font-semibold text-gray-900">
                1
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Create your job posting
              </h3>
              <p className="mt-2 text-gray-600">
                Write your job description with AI assistance. Our system helps you
                craft compelling listings that attract qualified candidates.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center border-2 border-gray-900 text-lg font-semibold text-gray-900">
                2
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Publish everywhere
              </h3>
              <p className="mt-2 text-gray-600">
                With one click, your job posting goes live on all major job boards.
                The Chrome extension handles the multi-platform distribution.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center border-2 border-gray-900 text-lg font-semibold text-gray-900">
                3
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Review and hire
              </h3>
              <p className="mt-2 text-gray-600">
                AI scores incoming resumes automatically. Review top candidates,
                move them through your pipeline, and make data-driven hiring
                decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-semibold text-white">75%</div>
              <div className="mt-2 text-gray-400">Time saved on posting</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-white">3x</div>
              <div className="mt-2 text-gray-400">Faster candidate screening</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-white">50+</div>
              <div className="mt-2 text-gray-400">Companies trust PostKit</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              Ready to transform your hiring process?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join HR teams who have streamlined their recruitment with PostKit.
              Start your free trial today.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8"
                >
                  Get started for free
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Free plan available.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-xl font-semibold text-gray-900">PostKit</div>
            <nav className="mt-6 md:mt-0 flex space-x-8">
              <Link
                href="#features"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            2024 PostKit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
