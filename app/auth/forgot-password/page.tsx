'use client'

import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Имитация отправки
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1000)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Письмо отправлено
            </h1>
            <p className="text-secondary-600 mb-6">
              Мы отправили инструкции по восстановлению пароля на адрес {email}
            </p>
            <div className="space-y-4">
              <Link href="/auth/login" className="btn-primary w-full text-center block">
                Вернуться к входу
              </Link>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-secondary-500 hover:text-secondary-700"
              >
                Отправить повторно
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900">
            Восстановление пароля
          </h1>
          <p className="mt-2 text-secondary-600">
            Введите email для получения инструкций
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Отправка...' : 'Отправить инструкции'}
            </button>
          </form>

          {/* Возврат к входу */}
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="inline-flex items-center text-sm text-secondary-600 hover:text-secondary-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к входу
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 