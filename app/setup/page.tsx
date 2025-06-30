'use client';

import { useState } from 'react';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/setup-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Произошла ошибка при настройке базы данных');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
      console.error('Setup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 Настройка базы данных TechnoMart
          </h1>
          <p className="text-gray-600">
            Нажмите кнопку ниже для инициализации базы данных и создания начальных данных
          </p>
        </div>

        {/* Кнопка инициализации */}
        <div className="text-center mb-8">
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Настройка базы данных...
              </div>
            ) : (
              '🔧 Инициализировать базу данных'
            )}
          </button>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  ❌ Ошибка
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Результат успешной настройки */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex">
              <div className="ml-3 w-full">
                <h3 className="text-lg font-medium text-green-800 mb-4">
                  ✅ {result.message}
                </h3>
                
                {/* Шаги выполнения */}
                <div className="mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">Выполненные шаги:</h4>
                  <ul className="space-y-1">
                    {result.steps?.map((step: string, index: number) => (
                      <li key={index} className="text-sm text-green-700 flex items-center">
                        <span className="mr-2">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Учетные данные */}
                <div className="bg-white rounded border border-green-300 p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-3">🔑 Данные для входа:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <h5 className="font-medium text-blue-800">👑 Администратор</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        <strong>Email:</strong> {result.login?.email}<br/>
                        <strong>Пароль:</strong> {result.login?.password}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="font-medium text-gray-800">👤 Пользователь</h5>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Email:</strong> user@technomart.ru<br/>
                        <strong>Пароль:</strong> User123!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Следующие шаги */}
                <div className="mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">Следующие шаги:</h4>
                  <ol className="space-y-1">
                    {result.nextSteps?.map((step: string, index: number) => (
                      <li key={index} className="text-sm text-green-700 flex items-start">
                        <span className="mr-2 font-medium">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Кнопки действий */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <a
                    href="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🏠 Перейти на главную
                  </a>
                  <a
                    href="/auth/login"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🔐 Войти в систему
                  </a>
                  <a
                    href="/admin"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    ⚙️ Админ-панель
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Информация */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            ℹ️ Информация
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Эта страница создаст все необходимые таблицы в базе данных</li>
            <li>• Будут созданы тестовые пользователи, категории и товары</li>
            <li>• Операция безопасна и может выполняться несколько раз</li>
            <li>• После успешной настройки можете начать использовать сайт</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 