// apps/web/src/app/(auth)/login/page.tsx

import Link from 'next/link'
import { LoginForm } from './login-form'

export default function LoginPage() {
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
            더 스마트한<br />
            채용을 시작하세요
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            한 번의 작성으로 전 플랫폼 게시. AI 기반 이력서 분석.
            통합 채용 파이프라인 관리.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          HR 전문가들이 신뢰하는 플랫폼
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              로그인
            </h2>
            <p className="mt-2 text-gray-600">
              계정 정보를 입력하여 대시보드에 접속하세요
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-medium text-gray-900 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
