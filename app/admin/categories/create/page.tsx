'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
}

interface CategoryForm {
  name: string
  description: string
  parentId: string
  sortOrder: string
  isActive: boolean
  image: string
}

export default function CreateCategoryPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: '',
    parentId: '',
    sortOrder: '0',
    isActive: true,
    image: ''
  })

  // Загружаем категории для выбора родительской
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const headers: HeadersInit = {}
        
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch('/api/categories', {
          headers,
          credentials: 'include',
        })
        const data = await response.json()
        setCategories(data.data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Ошибка загрузки категорий')
      }
      setIsLoadingData(false)
    }

    fetchCategories()
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
          sortOrder: parseInt(formData.sortOrder),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Категория успешно создана!')
        setTimeout(() => {
          router.push('/admin/categories')
        }, 2000)
      } else {
        setError(data.error || 'Ошибка создания категории')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте позже.')
    }
    setIsLoading(false)
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Добавить категорию</h1>
            <p className="text-muted-foreground">Создание новой категории товаров</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Form */}
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Основная информация</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Название категории *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Введите название категории"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Описание категории"
                    rows={3}
                    className="w-full p-3 border rounded-lg resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Родительская категория</label>
                  <select
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Корневая категория</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Порядок сортировки</label>
                    <Input
                      name="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm">Активна</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL изображения</label>
                  <Input
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Рекомендуемый размер: 300x300 пикселей
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Создать категорию
                  </>
                )}
              </Button>
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Отмена
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 