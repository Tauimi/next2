'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { login } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Успешный вход - используем auth store
        // API теперь возвращает data.user и data.token напрямую
        const user = data.user || data.data?.user
        const token = data.token || data.data?.token
        
        if (user && token) {
          login(user, token)
          router.push(user.isAdmin ? '/admin' : '/')
        } else {
          setError('Ошибка получения данных пользователя')
        }
      } else {
        setError(data.error || 'Ошибка входа')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  // Функция для быстрого входа
  const quickLogin = async (email: string, password: string) => {
    setFormData({ email, password })
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const user = data.user || data.data?.user
        const token = data.token || data.data?.token
        
        if (user && token) {
          login(user, token)
          router.push(user.isAdmin ? '/admin' : '/')
        } else {
          setError('Ошибка получения данных пользователя')
        }
      } else {
        setError(data.error || 'Ошибка входа')
      }
    } catch (err) {
      console.error('Quick login error:', err)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900">
            Вход в аккаунт
          </h1>
          <p className="mt-2 text-secondary-600">
            Войдите в свой аккаунт TechnoMart
          </p>
        </div>

        {/* Форма */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ошибка */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Запомнить меня */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-secondary-700">
                  Запомнить меня
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                Забыли пароль?
              </Link>
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {/* Тестовые аккаунты */}
          <div className="mt-6 space-y-4">
            {/* Администратор */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Тестовый вход (Администратор):</h3>
              <div className="text-sm text-blue-700 space-y-1 mb-3">
                <p>Email: admin@technomart.ru</p>
                <p>Пароль: Admin123!</p>
              </div>
              <button
                type="button"
                onClick={() => quickLogin('admin@technomart.ru', 'Admin123!')}
                disabled={loading}
                className="w-full btn-secondary text-sm"
              >
                Войти как администратор
              </button>
            </div>

            {/* Пользователь */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 mb-2">Тестовый вход (Пользователь):</h3>
              <div className="text-sm text-green-700 space-y-1 mb-3">
                <p>Email: user@technomart.ru</p>
                <p>Пароль: User123!</p>
              </div>
              <button
                type="button"
                onClick={() => quickLogin('user@technomart.ru', 'User123!')}
                disabled={loading}
                className="w-full btn-secondary text-sm"
              >
                Войти как пользователь
              </button>
            </div>
          </div>

          {/* Регистрация */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Нет аккаунта?{' '}
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-500 font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        {/* Возврат на главную */}
        <div className="text-center">
          <Link href="/" className="text-sm text-secondary-500 hover:text-secondary-700">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
} 