// apps/web/src/app/extension/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                PostKit
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                기능
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                사용방법
              </Link>
              <Link
                href="/extension"
                className="text-sm font-medium text-gray-900"
              >
                익스텐션
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mb-6">
              준비중
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              PostKit 크롬 익스텐션
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              채용 플랫폼을 넘나들며 공고 게시와 이력서 채점을 자동화하는
              강력한 크롬 익스텐션. 현재 개발 중이며 곧 출시 예정입니다.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                disabled
                className="bg-gray-300 text-gray-500 cursor-not-allowed h-12 px-8"
              >
                출시 예정
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900">
              익스텐션 주요 기능
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              출시 시 제공될 핵심 기능들을 미리 확인하세요
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Feature 1 */}
            <div className="bg-white p-8 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  멀티 플랫폼 자동 게시
                </h3>
              </div>
              <p className="text-gray-600">
                PostKit에서 작성한 채용공고를 잡코리아, 사람인, 원티드, 점핏 등
                주요 채용 플랫폼에 자동으로 게시합니다. 각 플랫폼의 입력 폼을
                자동으로 채워주어 반복 작업을 없앱니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">잡코리아</Badge>
                <Badge variant="outline">사람인</Badge>
                <Badge variant="outline">원티드</Badge>
                <Badge variant="outline">점핏</Badge>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  AI 이력서 실시간 채점
                </h3>
              </div>
              <p className="text-gray-600">
                각 채용 플랫폼의 지원자 목록 페이지에서 이력서를 자동으로 파싱하고
                AI가 실시간으로 채점합니다. 채용 요건 대비 적합도, 강점, 리스크를
                즉시 확인할 수 있습니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">GPT-4o</Badge>
                <Badge variant="outline">Claude</Badge>
                <Badge variant="outline">실시간 분석</Badge>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  개인정보 보호
                </h3>
              </div>
              <p className="text-gray-600">
                사용자의 API Key는 브라우저에만 저장되며 서버에 전송되지 않습니다.
                이력서 원문은 서버에 저장하지 않고, 채점 결과 요약만 동기화합니다.
                개인정보 보호를 최우선으로 설계했습니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">로컬 암호화</Badge>
                <Badge variant="outline">서버 미저장</Badge>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  PostKit 대시보드 연동
                </h3>
              </div>
              <p className="text-gray-600">
                익스텐션에서 채점한 결과는 PostKit 대시보드와 자동으로 동기화됩니다.
                웹에서 전체 지원자 현황을 한눈에 확인하고, 파이프라인을 관리하세요.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">실시간 동기화</Badge>
                <Badge variant="outline">파이프라인 연동</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900">
              사용 방법
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              설치 후 바로 사용 가능한 간편한 워크플로우
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full text-lg font-semibold text-gray-900">
                1
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                익스텐션 설치
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                크롬 웹스토어에서 PostKit 익스텐션을 설치합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full text-lg font-semibold text-gray-900">
                2
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                API Key 설정
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                OpenAI 또는 Claude API Key를 설정합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full text-lg font-semibold text-gray-900">
                3
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                채용 플랫폼 방문
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                잡코리아, 사람인 등 채용 플랫폼에 접속합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full text-lg font-semibold text-gray-900">
                4
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                자동화 실행
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                공고 게시 또는 이력서 채점을 클릭 한 번에 실행합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-white">
              출시 알림을 받으세요
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              크롬 익스텐션 출시 시 가장 먼저 알려드립니다.
              지금 PostKit에 가입하고 기다려 주세요.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-8"
                >
                  무료 가입하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-xl font-semibold text-gray-900">PostKit</div>
            <nav className="mt-6 md:mt-0 flex space-x-8">
              <Link
                href="/#features"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                기능
              </Link>
              <Link
                href="/extension"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                익스텐션
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                로그인
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            2024 PostKit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
