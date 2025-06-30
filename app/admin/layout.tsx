'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, LogOut, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    // Даем время для инициализации Zustand store
    const timer = setTimeout(() => {
      checkAdminAccess()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [user])

  const checkAdminAccess = async () => {
    try {
      // Проверяем данные из Zustand store
      if (!user) {
        throw new Error('Не авторизован')
      }

      if (!user.isAdmin) {
        throw new Error('Недостаточно прав доступа')
      }

      // Пользователь авторизован и является админом
      setError(null)
    } catch (error) {
      console.error('Admin access check failed:', error)
      setError(error instanceof Error ? error.message : 'Ошибка проверки доступа')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Показываем загрузку пока проверяем доступ или store не инициализирован
  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-lg font-semibold text-center mb-2">
            Проверка доступа...
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Проверяем права администратора
          </p>
        </div>
      </div>
    )
  }

  // Показываем ошибку доступа
  if (error || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-center mb-2 text-red-600">
            Доступ запрещён
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {error || 'У вас нет прав администратора для доступа к этой странице'}
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Войти как администратор
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                На главную
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Показываем админ-панель
  return (
    <div className="min-h-screen bg-muted/50">
      {/* Admin Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h1 className="font-semibold">Админ-панель</h1>
                <p className="text-xs text-muted-foreground">TechnoMart</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/admin" 
                className="text-sm hover:text-primary transition-colors"
              >
                Главная
              </Link>
              <Link 
                href="/admin/products" 
                className="text-sm hover:text-primary transition-colors"
              >
                Товары
              </Link>
              <Link 
                href="/admin/categories" 
                className="text-sm hover:text-primary transition-colors"
              >
                Категории
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">Администратор</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main>{children}</main>

      {/* Back to site link */}
      <div className="fixed bottom-4 left-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            ← На сайт
          </Link>
        </Button>
      </div>
    </div>
  )
} 