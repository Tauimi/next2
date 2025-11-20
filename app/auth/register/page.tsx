'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { validateEmail, validateName } from '@/lib/validation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [validationState, setValidationState] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { login } = useAuthStore()
  
  const isFormValid = Object.values(validationState).every(v => v)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) {
      setError('Пожалуйста, заполните все поля корректно')
      return
    }
    
    setLoading(true)
    setError('')

    // Проверка пароля
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Успешная регистрация - автоматически входим в систему
        login(data.user, data.token)
        
        // Перенаправляем на главную или профиль
        router.push('/')
      } else {
        setError(data.error || 'Ошибка регистрации')
      }
    } catch (err) {
      console.error('Registration error:', err)
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
            Регистрация
          </h1>
          <p className="mt-2 text-secondary-600">
            Создайте новый аккаунт TechnoMart
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

            {/* Имя и Фамилия */}
            <div className="grid grid-cols-2 gap-4">
              <ValidatedInput
                label="Имя"
                placeholder="Имя"
                value={formData.firstName}
                onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
                validationRules={{
                  required: true,
                  minLength: 2,
                  maxLength: 50,
                  pattern: /^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
                  message: 'Имя должно содержать только буквы (минимум 2 символа)'
                }}
                onValidationChange={(result) => 
                  setValidationState(prev => ({ ...prev, firstName: result.isValid }))
                }
              />

              <ValidatedInput
                label="Фамилия"
                placeholder="Фамилия"
                value={formData.lastName}
                onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
                validationRules={{
                  required: true,
                  minLength: 2,
                  maxLength: 50,
                  pattern: /^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
                  message: 'Фамилия должна содержать только буквы (минимум 2 символа)'
                }}
                onValidationChange={(result) => 
                  setValidationState(prev => ({ ...prev, lastName: result.isValid }))
                }
              />
            </div>

            {/* Username */}
            <ValidatedInput
              label="Логин"
              placeholder="username"
              value={formData.username}
              onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
              validationRules={{
                required: true,
                minLength: 3,
                maxLength: 20,
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Логин должен содержать только латинские буквы, цифры и _ (минимум 3 символа)'
              }}
              onValidationChange={(result) => 
                setValidationState(prev => ({ ...prev, username: result.isValid }))
              }
            />

            {/* Email */}
            <ValidatedInput
              label="Email адрес"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              validationRules={{
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Введите корректный email адрес'
              }}
              onValidationChange={(result) => 
                setValidationState(prev => ({ ...prev, email: result.isValid }))
              }
            />

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
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-secondary-500">
                Минимум 8 символов
              </p>
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Согласие */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-secondary-700">
                Я соглашаюсь с{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                  условиями использования
                </Link>{' '}
                и{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                  политикой конфиденциальности
                </Link>
              </label>
            </div>

            {/* Кнопка регистрации */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Тестовый доступ */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Тестовый доступ:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Вместо регистрации можете войти с:</strong></p>
              <p>Email: user@technomart.ru</p>
              <p>Пароль: User123!</p>
            </div>
          </div>

          {/* Вход */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Войти
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