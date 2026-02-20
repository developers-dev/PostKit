// apps/web/src/app/(auth)/signup/page.tsx

import Link from 'next/link'
import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-between p-12">
        <div>
          <h1 className="text-2xl font-semibold">PostKit</h1>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold leading-tight">
            Start Hiring<br />
            Smarter Today
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Join thousands of HR professionals who save hours every week
            with AI-powered resume scoring and multi-platform job posting.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Free to get started
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">
              Get started with PostKit in minutes
            </p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
