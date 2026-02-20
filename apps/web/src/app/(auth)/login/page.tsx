// apps/web/src/app/(auth)/login/page.tsx

import Link from 'next/link'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-between p-12">
        <div>
          <h1 className="text-2xl font-semibold">Recruify</h1>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold leading-tight">
            Streamline Your<br />
            Hiring Process
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Post once, reach everywhere. Score resumes with AI.
            Manage your entire recruitment pipeline in one place.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Trusted by HR professionals
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-gray-600">
            Do not have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-gray-900 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
