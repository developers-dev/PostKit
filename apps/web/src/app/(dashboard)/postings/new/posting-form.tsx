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

  const handleGenerateJD = async () => {
    if (!formData.title) {
      setError('Please enter a job title first')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const techStackArray = formData.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const response = await fetch('/api/ai/generate-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          experience: formData.experience || undefined,
          techStack: techStackArray.length > 0 ? techStackArray : undefined,
          location: formData.location || undefined,
          employmentType: formData.employment_type,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate job description')
      }

      setFormData((prev) => ({
        ...prev,
        description: result.data.description,
        requirements: result.data.requirements,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate')
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
          salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
          salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
          location: formData.location,
          employment_type: formData.employment_type,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create posting')
      }

      router.push('/postings')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Seoul, Remote"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type</Label>
              <Select
                value={formData.employment_type}
                onValueChange={(value) =>
                  handleSelectChange('employment_type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 3-5 years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_min">Salary Range (Min)</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="e.g., 50000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max">Salary Range (Max)</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="e.g., 70000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech_stack">Tech Stack</Label>
            <Input
              id="tech_stack"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="e.g., React, TypeScript, Node.js (comma separated)"
            />
            <p className="text-xs text-gray-500">
              Separate multiple technologies with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Generation */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900">
            AI-Powered Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Fill in the basic information above, then use AI to automatically
            generate the job description and requirements.
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
                Generating...
              </>
            ) : (
              'Generate with AI'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the required qualifications, experience, and skills..."
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
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Posting'}
        </Button>
      </div>
    </form>
  )
}
