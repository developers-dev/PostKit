// apps/web/src/app/(auth)/login/login-form.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full bg-gray-900 hover:bg-gray-800"
      disabled={pending}
    >
      {pending ? '로그인 중...' : '로그인'}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  function handleDemoLogin() {
    setIsDemoLoading(true)
    // Store demo session in localStorage
    localStorage.setItem('postkit_demo_session', JSON.stringify({
      user: {
        id: 'demo-admin',
        email: 'admin@postkit.demo',
        name: 'Demo Admin',
        company: 'PostKit Demo Company'
      },
      isDemo: true,
      createdAt: new Date().toISOString()
    }))
    router.push('/dashboard')
  }

  return (
    <div className="space-y-6">
      {/* Demo Login Button */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleDemoLogin}
          disabled={isDemoLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isDemoLoading ? '로딩중...' : '데모 로그인 (해커톤)'}
        </Button>
        <p className="text-xs text-center text-gray-500">
          회원가입 없이 플랫폼을 체험해 보세요
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">또는 이메일로 로그인</span>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            이메일
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">
            비밀번호
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="비밀번호를 입력하세요"
            className="h-11"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
