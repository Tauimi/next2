'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { ValidatedTextarea } from '@/components/ui/ValidatedTextarea'

interface CategoryForm {
  name: string
  description: string
  sortOrder: string
  isActive: boolean
  image: string
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationState, setValidationState] = useState({
    name: true // true по умолчанию, т.к. данные загружаются с сервера
  })

  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: '',
    sortOrder: '0',
    isActive: true,
    image: ''
  })

  // Загружаем данные категории
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Category not found')
        }

        const category = data.data

        setFormData({
          name: category.name || '',
          description: category.description || '',
          sortOrder: category.sortOrder?.toString() || '0',
          isActive: category.isActive ?? true,
          image: category.image || ''
        })
      } catch (error) {
        console.error('Error fetching category:', error)
        setError(error instanceof Error ? error.message : 'Ошибка загрузки данных')
      }
      setIsLoadingData(false)
    }

    fetchCategory()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          sortOrder: parseInt(formData.sortOrder),
          isActive: formData.isActive,
          image: formData.image || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Категория успешно обновлена!')
        setTimeout(() => {
          router.push('/admin/categories')
        }, 1500)
      } else {
        setError(data.error || 'Ошибка обновления категории')
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

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ошибка</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/admin/categories">
            <Button>Вернуться к списку категорий</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/categories">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Редактировать категорию</h1>
            <p className="text-muted-foreground">Изменение информации о категории</p>
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
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
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
              <label className="block text-sm font-medium mb-2">URL изображения</label>
              <Input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Порядок сортировки</label>
              <Input
                name="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={handleInputChange}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Чем меньше число, тем выше категория в списке
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-sm font-medium">Активна</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
            <Link href="/admin/categories">
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
