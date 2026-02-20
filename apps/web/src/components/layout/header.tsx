// apps/web/src/components/layout/header.tsx

'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { logout } from '@/app/(auth)/actions'

interface HeaderProps {
  title?: string
  userEmail?: string
  companyName?: string
  isDemo?: boolean
}

export function Header({ title, userEmail, companyName, isDemo }: HeaderProps) {
  const router = useRouter()
  const initials = userEmail
    ? userEmail.substring(0, 2).toUpperCase()
    : 'UK'

  function handleDemoLogout() {
    // Clear demo session
    localStorage.removeItem('postkit_demo_session')
    document.cookie = 'postkit_demo=; path=/; max-age=0'
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          {title && (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isDemo && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              데모 모드
            </Badge>
          )}
          {companyName && (
            <span className="text-sm text-gray-600">{companyName}</span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-gray-900">
                  {userEmail || 'User'}
                </p>
                {companyName && (
                  <p className="text-xs text-gray-500">{companyName}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/settings" className="cursor-pointer">
                  설정
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isDemo ? (
                <DropdownMenuItem onClick={handleDemoLogout} className="cursor-pointer">
                  로그아웃
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <form action={logout} className="w-full">
                    <button type="submit" className="w-full text-left">
                      로그아웃
                    </button>
                  </form>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
