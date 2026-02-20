// apps/web/src/app/(auth)/signup/signup-form.tsx

'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full bg-gray-900 hover:bg-gray-800"
      disabled={pending}
    >
      {pending ? '계정 생성 중...' : '계정 만들기'}
    </Button>
  )
}

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-gray-700">
          회사명
        </Label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          required
          placeholder="회사명을 입력하세요"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          업무용 이메일
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
          autoComplete="new-password"
          required
          placeholder="최소 8자 이상"
          minLength={8}
          className="h-11"
        />
      </div>

      <SubmitButton />

      <p className="text-xs text-gray-500 text-center">
        계정을 생성하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
      </p>
    </form>
  )
}
