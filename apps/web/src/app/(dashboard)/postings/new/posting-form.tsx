// apps/web/src/app/(dashboard)/postings/new/posting-form.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PostingFormData {
  title: string
  description: string
  requirements: string
  tech_stack: string
  salary_min: string
  salary_max: string
  location: string
  employment_type: string
  experience: string
}

export function PostingForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<PostingFormData>({
    title: '',
    description: '',
    requirements: '',
    tech_stack: '',
    salary_min: '',
    salary_max: '',
    location: '',
    employment_type: 'full-time',
    experience: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Format number with commas (e.g., 100000 -> 100,000)
  const formatNumberWithCommas = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, '')
    if (!numericValue) return ''
    return Number(numericValue).toLocaleString('ko-KR')
  }

  // Handle salary input with formatting
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const formattedValue = formatNumberWithCommas(value)
    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
  }

  // Remove commas to get raw number for submission
  const getRawNumber = (value: string): number | null => {
    const numericValue = value.replace(/[^0-9]/g, '')
    return numericValue ? parseInt(numericValue) : null
  }

  const handleGenerateJD = async () => {
    if (!formData.title) {
      setError('먼저 직무명을 입력해주세요')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const techStackArray = formData.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      // Get API key from localStorage
      const savedApiKey = localStorage.getItem('postkit_openai_key')

      const response = await fetch('/api/ai/generate-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          experience: formData.experience || undefined,
          techStack: techStackArray.length > 0 ? techStackArray : undefined,
          location: formData.location || undefined,
          employmentType: formData.employment_type,
          apiKey: savedApiKey || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '채용공고 생성에 실패했습니다')
      }

      setFormData((prev) => ({
        ...prev,
        description: result.data.description,
        requirements: result.data.requirements,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성에 실패했습니다')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const techStackArray = formData.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const response = await fetch('/api/postings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          tech_stack: techStackArray,
          salary_min: getRawNumber(formData.salary_min),
          salary_max: getRawNumber(formData.salary_max),
          location: formData.location,
          employment_type: formData.employment_type,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '공고 생성에 실패했습니다')
      }

      router.push('/postings')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">직무명 *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 시니어 프론트엔드 개발자"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">근무지</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="예: 서울, 원격"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment_type">고용 형태</Label>
              <Select
                value={formData.employment_type}
                onValueChange={(value) =>
                  handleSelectChange('employment_type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">정규직</SelectItem>
                  <SelectItem value="part-time">파트타임</SelectItem>
                  <SelectItem value="contract">계약직</SelectItem>
                  <SelectItem value="internship">인턴</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="experience">경력</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="예: 3-5년"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_min">연봉 범위 (최소)</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="text"
                inputMode="numeric"
                value={formData.salary_min}
                onChange={handleSalaryChange}
                placeholder="예: 50,000,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max">연봉 범위 (최대)</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="text"
                inputMode="numeric"
                value={formData.salary_max}
                onChange={handleSalaryChange}
                placeholder="예: 70,000,000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech_stack">기술 스택</Label>
            <Input
              id="tech_stack"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="예: React, TypeScript, Node.js (쉼표로 구분)"
            />
            <p className="text-xs text-gray-500">
              여러 기술은 쉼표로 구분하세요
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Generation */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900">
            AI 자동 생성
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            위의 기본 정보를 입력한 후, AI를 사용하여 채용공고 내용과
            자격 요건을 자동으로 생성할 수 있습니다.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateJD}
            disabled={isGenerating || !formData.title}
            className="border-gray-300"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                생성 중...
              </>
            ) : (
              'AI로 생성하기'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            상세 내용
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">채용공고 내용</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="역할, 담당 업무, 주요 프로젝트 등을 상세히 작성하세요..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">자격 요건</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="필수 자격, 경력 요건, 기술 스킬 등을 작성하세요..."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          className="border-gray-300"
          onClick={() => router.push('/postings')}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? '생성 중...' : '공고 등록'}
        </Button>
      </div>
    </form>
  )
}
