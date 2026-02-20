// apps/web/src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Recruify - 채용 자동화 플랫폼',
  description:
    '채용공고 한 번 작성으로 전 플랫폼 자동 게시. AI 기반 이력서 분석. 통합 채용 파이프라인 관리.',
  keywords: ['채용', '인사', 'HR', '채용공고', '이력서', 'AI', '자동화'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
