// apps/web/src/components/demo-login-button.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface DemoLoginButtonProps {
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function DemoLoginButton({ size = 'lg', className }: DemoLoginButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  function handleDemoLogin() {
    setIsLoading(true)
    localStorage.setItem('postkit_demo_session', JSON.stringify({
      user: {
        id: 'demo-admin',
        email: 'admin@postkit.demo',
        name: 'Demo Admin',
        company: 'Recruify Demo Company'
      },
      isDemo: true,
      createdAt: new Date().toISOString()
    }))
    // Also set a cookie for server-side middleware to recognize demo session
    document.cookie = 'postkit_demo=true; path=/; max-age=86400; SameSite=Lax'
    router.push('/dashboard')
  }

  return (
    <Button
      onClick={handleDemoLogin}
      disabled={isLoading}
      size={size}
      className={className}
    >
      {isLoading ? '로딩중...' : '데모 체험'}
    </Button>
  )
}
