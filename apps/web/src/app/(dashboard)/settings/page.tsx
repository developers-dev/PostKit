// apps/web/src/app/(dashboard)/settings/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [isSavingApi, setIsSavingApi] = useState(false)
  const [companySaveMessage, setCompanySaveMessage] = useState<string | null>(null)
  const [apiSaveMessage, setApiSaveMessage] = useState<string | null>(null)

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('postkit_settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setCompanyName(settings.companyName || '')
        setIndustry(settings.industry || '')
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }

    const savedApiKey = localStorage.getItem('postkit_openai_key')
    if (savedApiKey) {
      // Show masked version
      setOpenaiKey(savedApiKey)
    }
  }, [])

  const handleSaveCompany = async () => {
    setIsSavingCompany(true)
    setCompanySaveMessage(null)

    try {
      // Save to localStorage for demo
      const settings = { companyName, industry }
      localStorage.setItem('postkit_settings', JSON.stringify(settings))

      setCompanySaveMessage('저장되었습니다!')
      setTimeout(() => setCompanySaveMessage(null), 3000)
    } catch (error) {
      setCompanySaveMessage('저장에 실패했습니다.')
    } finally {
      setIsSavingCompany(false)
    }
  }

  const handleSaveApiKey = async () => {
    setIsSavingApi(true)
    setApiSaveMessage(null)

    try {
      if (!openaiKey.trim()) {
        setApiSaveMessage('API 키를 입력해주세요.')
        return
      }

      // Save to localStorage for demo
      localStorage.setItem('postkit_openai_key', openaiKey)

      setApiSaveMessage('API 키가 저장되었습니다!')
      setTimeout(() => setApiSaveMessage(null), 3000)
    } catch (error) {
      setApiSaveMessage('저장에 실패했습니다.')
    } finally {
      setIsSavingApi(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">설정</h1>
        <p className="mt-1 text-sm text-gray-600">
          계정 및 애플리케이션 설정을 관리하세요
        </p>
      </div>

      {/* Company Settings */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            회사 정보
          </CardTitle>
          <CardDescription>
            회사 정보를 수정하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">회사명</Label>
              <Input
                id="companyName"
                placeholder="회사명을 입력하세요"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">업종</Label>
              <Input
                id="industry"
                placeholder="IT/소프트웨어"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-gray-900 hover:bg-gray-800"
              onClick={handleSaveCompany}
              disabled={isSavingCompany}
            >
              {isSavingCompany ? '저장 중...' : '저장'}
            </Button>
            {companySaveMessage && (
              <span className={`text-sm ${companySaveMessage.includes('실패') ? 'text-red-600' : 'text-green-600'}`}>
                {companySaveMessage}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            API 설정
          </CardTitle>
          <CardDescription>
            AI 기능을 위한 OpenAI API 키를 설정하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openaiKey">OpenAI API Key</Label>
            <Input
              id="openaiKey"
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              API 키는 브라우저에 안전하게 저장됩니다. JD 자동 작성 및 이력서 채점에 사용됩니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-gray-900 hover:bg-gray-800"
              onClick={handleSaveApiKey}
              disabled={isSavingApi}
            >
              {isSavingApi ? '저장 중...' : 'API 키 저장'}
            </Button>
            {apiSaveMessage && (
              <span className={`text-sm ${apiSaveMessage.includes('실패') || apiSaveMessage.includes('입력') ? 'text-red-600' : 'text-green-600'}`}>
                {apiSaveMessage}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-red-600">
            위험 구역
          </CardTitle>
          <CardDescription>
            되돌릴 수 없는 작업입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">계정 삭제</p>
              <p className="text-sm text-gray-500">
                계정과 모든 관련 데이터가 영구적으로 삭제됩니다
              </p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              계정 삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
