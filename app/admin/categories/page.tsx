'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Eye, Tags, Folder } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number
  sortOrder: number
  isActive: boolean
  image?: string
  _count: {
    products: number
  }
  children?: Category[]
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const toggleCategoryStatus = async (categoryId: number, currentStatus: boolean) => {
    try {
      // TODO: Создать API endpoint для обновления статуса категории
      console.log(`Toggle category ${categoryId} status from ${currentStatus} to ${!currentStatus}`)
      setCategories(prev => prev.map(category => 
        category.id === categoryId 
          ? { ...category, isActive: !currentStatus }
          : category
      ))
    } catch (error) {
      console.error('Error updating category status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Загрузка категорий...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Категории</h1>
              <p className="text-muted-foreground">
                Всего категорий: {categories.length}
              </p>
            </div>
          </div>
          <Link href="/admin/categories/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить категорию
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Category Image */}
              {category.image && (
                <div className="mb-4">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Category Info */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        category.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {category.isActive ? 'Активна' : 'Неактивна'}
                    </button>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Folder className="w-4 h-4" />
                    <span>{category._count.products} товаров</span>
                  </div>
                  <div>
                    Порядок: {category.sortOrder}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/catalog/${category.slug}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Просмотр
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Категории не добавлены
              </h3>
              <p className="text-muted-foreground mb-4">
                Создайте первую категорию для организации товаров
              </p>
              <Link href="/admin/categories/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить категорию
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        {categories.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Статистика категорий</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Активные</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {categories.filter(c => !c.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Неактивные</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {categories.reduce((total, c) => total + c._count.products, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Всего товаров</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {categories.filter(c => c.parentId === null).length}
                </div>
                <div className="text-sm text-muted-foreground">Корневые категории</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 