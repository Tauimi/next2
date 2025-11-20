'use client'

import { useState, useEffect } from 'react'
import { Package, Tags, Users, BarChart3, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface DashboardStats {
  products: number
  categories: number
  orders: number
  users: number
  revenue: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // Получаем статистику товаров и категорий
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setStats({
        products: productsData.data?.length || 0,
        categories: categoriesData.data?.length || 0,
        orders: 0,
        users: 0,
        revenue: 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const statsCards = [
    {
      title: 'Товары',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products'
    },
    {
      title: 'Категории',
      value: stats.categories,
      icon: Tags,
      color: 'bg-green-500',
      href: '/admin/categories'
    },
    {
      title: 'Заказы',
      value: stats.orders,
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '/admin/orders'
    },
    {
      title: 'Пользователи',
      value: stats.users,
      icon: Users,
      color: 'bg-orange-500',
      href: '/admin/users'
    }
  ]

  const quickActions = [
    {
      title: 'Добавить товар',
      description: 'Создать новый товар в каталоге',
      icon: Package,
      href: '/admin/products/create',
      color: 'bg-primary'
    },
    {
      title: 'Добавить категорию',
      description: 'Создать новую категорию товаров',
      icon: Tags,
      href: '/admin/categories/create',
      color: 'bg-green-600'
    },
    {
      title: '🔧 Очистка товаров',
      description: 'Найти и удалить "призрачные" товары из БД',
      icon: RefreshCw,
      href: '/admin/cleanup',
      color: 'bg-red-600'
    }
  ]

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
          <h1 className="text-3xl font-bold">Панель управления</h1>
            <p className="text-muted-foreground">Управление содержимым сайта</p>
          </div>
          <Button onClick={fetchStats} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">
                      {isLoading ? '...' : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Управление товарами
            </h3>
            <div className="space-y-2">
              <Link href="/admin/products" className="block text-sm text-muted-foreground hover:text-primary">
                Все товары
              </Link>
              <Link href="/admin/products/create" className="block text-sm text-muted-foreground hover:text-primary">
                Добавить товар
              </Link>
              <button 
                onClick={() => alert('Функция импорта в разработке')}
                className="block text-sm text-muted-foreground hover:text-primary text-left w-full"
              >
                Импорт товаров
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Tags className="w-5 h-5 text-green-600" />
              Управление категориями
            </h3>
            <div className="space-y-2">
              <Link href="/admin/categories" className="block text-sm text-muted-foreground hover:text-primary">
                Все категории
              </Link>
              <Link href="/admin/categories/create" className="block text-sm text-muted-foreground hover:text-primary">
                Добавить категорию
              </Link>
              <button 
                onClick={() => alert('Функция структуры категорий в разработке')}
                className="block text-sm text-muted-foreground hover:text-primary text-left w-full"
              >
                Структура категорий
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Система
            </h3>
            <div className="space-y-2">
              <button 
                onClick={async () => {
                  if (confirm('Создать базовые категории?')) {
                    try {
                      const res = await fetch('/api/init-categories', { method: 'POST' })
                      const data = await res.json()
                      alert(data.success ? `Создано категорий: ${data.data.length}` : 'Ошибка создания категорий')
                    } catch (error) {
                      alert('Ошибка при создании категорий')
                    }
                  }
                }}
                className="block text-sm text-muted-foreground hover:text-primary text-left w-full"
              >
                Создать базовые категории
              </button>
              <Link href="/api/debug" className="block text-sm text-muted-foreground hover:text-primary">
                Проверка системы
              </Link>
              <button 
                onClick={() => alert('Функция резервного копирования в разработке')}
                className="block text-sm text-muted-foreground hover:text-primary text-left w-full"
              >
                Резервное копирование
              </button>
            </div>
          </div>
        </div>
      </div>
  )
} 