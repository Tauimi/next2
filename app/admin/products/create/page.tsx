'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
}

interface ProductForm {
  name: string
  description: string
  shortDescription: string
  price: string
  originalPrice: string
  categoryId: string
  brandId: string
  inStock: boolean
  stockQuantity: string
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
}

export default function CreateProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    brandId: '1', // Apple по умолчанию
    inStock: true,
    stockQuantity: '1',
    isActive: true,
    isFeatured: false,
    isNew: false
  })

  // Загружаем категории
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Ошибка загрузки категорий')
      }
      setIsLoadingData(false)
    }

    fetchCategories()
  }, [])

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
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          categoryId: parseInt(formData.categoryId),
          brandId: parseInt(formData.brandId),
          stockQuantity: parseInt(formData.stockQuantity),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Товар успешно создан!')
        setTimeout(() => {
          router.push('/admin/products')
        }, 2000)
      } else {
        setError(data.error || 'Ошибка создания товара')
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
            <h1 className="text-3xl font-bold">Добавить товар</h1>
            <p className="text-muted-foreground">Создание нового товара в каталоге</p>
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Основная информация</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Название товара *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите название товара"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Краткое описание</label>
                <Input
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Краткое описание для карточки товара"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Полное описание *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Подробное описание товара"
                  rows={4}
                  className="w-full p-3 border rounded-lg resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Категория *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Бренд *</label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="1">Apple</option>
                  <option value="2">Samsung</option>
                  <option value="3">Sony</option>
                  <option value="4">LG</option>
                  <option value="5">Xiaomi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Цены и наличие</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Цена *</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Старая цена</label>
                <Input
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Количество на складе</label>
                <Input
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Статус товара</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-sm">Активен</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-sm">В наличии</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-sm">Рекомендуемый</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-sm">Новинка</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Создать товар
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
    </main>
  )
} 