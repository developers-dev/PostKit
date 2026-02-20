// apps/web/src/app/(dashboard)/applicants/score/resume-scorer.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ScoringResult {
  total_score: number
  skill_score: number
  culture_score: number
  career_score: number
  strengths: string[]
  risks: string[]
  recommended_questions: string[]
  summary: string
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'bg-green-500'
    if (s >= 80) return 'bg-blue-500'
    if (s >= 70) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{score}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getScoreColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export function ResumeScorer() {
  const [isScoring, setIsScoring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setResumeText('')
    }
  }

  const handleScore = async () => {
    if (!jobDescription) {
      setError('채용공고 내용을 입력해주세요')
      return
    }

    if (inputMode === 'file' && !resumeFile) {
      setError('이력서 PDF를 업로드해주세요')
      return
    }

    if (inputMode === 'text' && !resumeText) {
      setError('이력서 텍스트를 입력해주세요')
      return
    }

    setIsScoring(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('jobDescription', jobDescription)
      formData.append('requirements', requirements)

      if (inputMode === 'file' && resumeFile) {
        formData.append('resume', resumeFile)
      } else {
        formData.append('resumeText', resumeText)
      }

      // Get API key from localStorage
      const savedApiKey = localStorage.getItem('postkit_openai_key')
      if (savedApiKey) {
        formData.append('apiKey', savedApiKey)
      }

      const response = await fetch('/api/ai/score-resume', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '이력서 채점에 실패했습니다')
      }

      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setIsScoring(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <div className="space-y-6">
        {/* Resume Input */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              이력서
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inputMode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('file')}
                className={inputMode === 'file' ? 'bg-gray-900' : 'border-gray-300'}
              >
                PDF 업로드
              </Button>
              <Button
                type="button"
                variant={inputMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('text')}
                className={inputMode === 'text' ? 'bg-gray-900' : 'border-gray-300'}
              >
                텍스트 붙여넣기
              </Button>
            </div>

            {inputMode === 'file' ? (
              <div className="space-y-2">
                <Label htmlFor="resume">이력서 PDF</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {resumeFile && (
                  <p className="text-sm text-gray-600">
                    선택됨: {resumeFile.name}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="resumeText">이력서 텍스트</Label>
                <Textarea
                  id="resumeText"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="이력서 내용을 여기에 붙여넣으세요..."
                  rows={8}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              채용 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">채용공고 내용 *</Label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="채용공고 내용을 입력하세요..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">자격 요건</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="자격 요건을 입력하세요..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <Button
          onClick={handleScore}
          disabled={isScoring}
          className="w-full bg-gray-900 hover:bg-gray-800"
        >
          {isScoring ? (
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
              이력서 분석 중...
            </>
          ) : (
            '이력서 채점하기'
          )}
        </Button>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {result ? (
          <>
            {/* Total Score */}
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900">
                    {result.total_score}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">종합 점수</div>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  점수 상세
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreBar label="기술 적합도" score={result.skill_score} />
                <ScoreBar label="문화 적합도" score={result.culture_score} />
                <ScoreBar label="경력 성장성" score={result.career_score} />
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{result.summary}</p>
              </CardContent>
            </Card>

            {/* Strengths & Risks */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-green-700">
                    강점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-0.5">+</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-red-700">
                    리스크
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.risks.map((risk, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-red-500 mt-0.5">-</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Interview Questions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  추천 면접 질문
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommended_questions.map((question, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Badge
                        variant="outline"
                        className="mt-0.5 shrink-0 border-gray-300"
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-sm text-gray-600">{question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-gray-200 border-dashed">
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
                <p className="mt-4 text-sm">
                  이력서를 업로드하고 채용 정보를 입력하면 AI가 평가합니다
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
