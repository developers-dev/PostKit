// apps/web/src/app/(auth)/signup/page.tsx

import Link from 'next/link'
import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-between p-12">
        <div>
          <Link href="/" className="text-2xl font-semibold hover:text-gray-200">
            Recruify
          </Link>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold leading-tight">
            지금 바로<br />
            시작하세요
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            AI 기반 이력서 채점과 멀티 플랫폼 공고 게시로
            매주 수 시간을 절약하는 HR 전문가들과 함께하세요.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          무료로 시작하기
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              회원가입
            </h2>
            <p className="mt-2 text-gray-600">
              몇 분 안에 Recruify를 시작하세요
            </p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-gray-900 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
