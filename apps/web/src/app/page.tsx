// apps/web/src/app/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DemoLoginButton } from '@/components/demo-login-button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Recruify
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                How it works
              </Link>
              <Link
                href="/extension"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Extension
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <DemoLoginButton
                size="default"
                className="bg-blue-600 text-white hover:bg-blue-700"
              />
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
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              HR 팀을 위한
              <br />
              채용 자동화 플랫폼
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              채용공고 한 번 작성으로 전 플랫폼 자동 게시.
              AI 기반 이력서 분석으로 최적의 후보자 추천.
              하나의 대시보드에서 전체 채용 파이프라인 관리.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <DemoLoginButton
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 w-full sm:w-auto"
              />
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-gray-300 w-full sm:w-auto"
                >
                  무료 시작하기
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              회원가입 없이 데모 체험 가능
            </p>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              채용, 아직도 이렇게 하고 계신가요?
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              4개 플랫폼에 공고 복붙 → 이력서 200개 수동 검토 → PDF 포트폴리오는 그냥 패스
            </p>
            <p className="mt-2 text-xl font-medium text-blue-400">
              Recruify가 전부 대신합니다.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Pain Point 1 */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-white">
                오늘도 4개 플랫폼에<br />같은 공고를 복붙하셨나요?
              </h3>
              <p className="text-gray-400 mb-4">
                잡코리아, 사람인, 원티드, 점핏... 매번 같은 내용을 붙여넣기하느라 지치셨죠?
              </p>
              <p className="text-blue-400 font-medium">
                공고는 한 번만 쓰세요.<br />나머지는 Recruify가 합니다.
              </p>
            </div>

            {/* Pain Point 2 */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-white">
                이력서 200개,<br />오늘 안에 다 보셨나요?
              </h3>
              <p className="text-gray-400 mb-4">
                쏟아지는 지원서 속에서 좋은 후보를 찾기란 쉽지 않습니다.
              </p>
              <p className="text-blue-400 font-medium">
                AI가 10초 만에 점수로 줄 세워드립니다.<br />
                <span className="text-gray-500 text-sm">개인정보는 우리 서버에 남지 않습니다.</span>
              </p>
            </div>

            {/* Pain Point 3 */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-white">
                PDF 포트폴리오, Word 이력서,<br />PPT 작업물.
              </h3>
              <p className="text-gray-400 mb-4">
                채용 플랫폼에서 읽지 못하는 파일들, 하나하나 다운받아 열어보셨나요?
              </p>
              <p className="text-blue-400 font-medium">
                플랫폼이 못 읽는 파일,<br />Recruify는 읽습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              더 빠른 채용을 위한 모든 기능
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              공고 작성부터 최종 채용까지, 채용 프로세스를 혁신합니다
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                멀티 플랫폼 자동 게시
              </h3>
              <p className="mt-2 text-gray-600">
                채용공고 한 번 작성으로 잡코리아, 사람인, 원티드 등
                전 플랫폼에 자동 게시. 반복 작업 시간을 대폭 절감합니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                AI 이력서 자동 채점
              </h3>
              <p className="mt-2 text-gray-600">
                GPT-4o가 채용 요건에 맞춰 이력서를 분석합니다.
                점수, 강점, 리스크, 면접 질문까지 자동 생성합니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                파이프라인 통합 관리
              </h3>
              <p className="mt-2 text-gray-600">
                지원부터 최종 합격까지 모든 후보자를 한눈에.
                칸반 보드로 채용 파이프라인을 시각적으로 관리합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">사용 방법</h2>
            <p className="mt-4 text-lg text-gray-600">
              3단계로 시작하는 스마트 채용
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center border-2 border-gray-900 text-lg font-semibold text-gray-900">
                1
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                채용공고 작성
              </h3>
              <p className="mt-2 text-gray-600">
                AI가 직무명과 요구사항을 기반으로 매력적인 채용공고를
                자동으로 작성해 드립니다.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center border-2 border-gray-900 text-lg font-semibold text-gray-900">
                2
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                전 플랫폼 게시
              </h3>
              <p className="mt-2 text-gray-600">
                크롬 익스텐션으로 주요 채용 플랫폼에 한 번에 게시.
                더 이상 각 사이트에 일일이 등록할 필요가 없습니다.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center border-2 border-gray-900 text-lg font-semibold text-gray-900">
                3
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                AI 분석 및 채용
              </h3>
              <p className="mt-2 text-gray-600">
                AI가 지원자 이력서를 자동 채점하고 상위 후보를 추천합니다.
                데이터 기반의 채용 결정을 내리세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-semibold text-white">75%</div>
              <div className="mt-2 text-gray-400">공고 게시 시간 절감</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-white">3배</div>
              <div className="mt-2 text-gray-400">후보자 검토 속도 향상</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-white">50+</div>
              <div className="mt-2 text-gray-400">Recruify 도입 기업</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              채용 프로세스를 혁신할 준비가 되셨나요?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Recruify과 함께 스마트한 채용을 시작하세요.
              지금 바로 무료로 체험해 보세요.
            </p>
            <div className="mt-8">
              <DemoLoginButton
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8"
              />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              신용카드 불필요. 무료 플랜 제공.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-xl font-semibold text-gray-900">Recruify</div>
            <nav className="mt-6 md:mt-0 flex space-x-8">
              <Link
                href="#features"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/extension"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Extension
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            2024 Recruify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
