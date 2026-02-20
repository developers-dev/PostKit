// apps/web/src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PostKit - Recruitment Automation Platform',
  description:
    'Post once, reach everywhere. Score resumes with AI. Manage your entire recruitment pipeline in one place.',
  keywords: ['recruitment', 'hiring', 'HR', 'job posting', 'resume screening', 'AI'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
