// apps/web/src/app/(dashboard)/postings/[id]/edit/edit-form.tsx

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
import { Loader2 } from 'lucide-react'

interface Posting {
  id: string
  title: string
  description: string | null
  requirements: string | null
  tech_stack: string[]
  salary_min: number | null
  salary_max: number | null
  location: string | null
  employment_type: string
  status: string
}

interface EditPostingFormProps {
  posting: Posting
}

// Format number with commas (e.g., 100000 -> 100,000)
const formatNumberWithCommas = (value: string | number | null): string => {
  if (value === null || value === '') return ''
  const numericValue = String(value).replace(/[^0-9]/g, '')
  if (!numericValue) return ''
  return Number(numericValue).toLocaleString('ko-KR')
}

export function EditPostingForm({ posting }: EditPostingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: posting.title,
    description: posting.description || '',
    requirements: posting.requirements || '',
    tech_stack: posting.tech_stack?.join(', ') || '',
    salary_min: formatNumberWithCommas(posting.salary_min),
    salary_max: formatNumberWithCommas(posting.salary_max),
    location: posting.location || '',
    employment_type: posting.employment_type || 'full-time',
    status: posting.status || 'draft',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const techStackArray = formData.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const response = await fetch(`/api/postings/${posting.id}`, {
        method: 'PUT',
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
          status: formData.status,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '공고 수정에 실패했습니다')
      }

      router.push(`/postings/${posting.id}`)
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

          <div className="grid gap-4 md:grid-cols-3">
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
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">임시저장</SelectItem>
                  <SelectItem value="active">진행중</SelectItem>
                  <SelectItem value="closed">마감</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
              rows={6}
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
              rows={6}
            />
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          className="border-gray-300"
          onClick={() => router.push(`/postings/${posting.id}`)}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            '변경사항 저장'
          )}
        </Button>
      </div>
    </form>
  )
}
