'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface QuickProductForm {
  name: string
  price: string
  categoryId: string
  description: string
}

export default function QuickAddProduct() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState<QuickProductForm>({
    name: '',
    price: '',
    categoryId: 'smartphones',
    description: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          categoryId: parseInt(formData.categoryId),
          brandId: 1, // Apple по умолчанию
          shortDescription: formData.description,
          inStock: true,
          stockQuantity: 10,
          isActive: true
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Товар успешно добавлен!')
        setFormData({ name: '', price: '', categoryId: 'smartphones', description: '' })
        setTimeout(() => {
          setIsOpen(false)
          setMessage('')
        }, 2000)
      } else {
        setMessage(`❌ ${data.error || 'Ошибка создания товара'}`)
      }
    } catch (error) {
      setMessage('❌ Ошибка сети')
    }
    setIsLoading(false)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Быстро добавить товар
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-white rounded-lg shadow-2xl border p-6 w-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Быстрое добавление товара</h3>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded text-sm bg-muted">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="iPhone 15 Pro Max"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Цена *</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="119990"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Категория</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="smartphones">Смартфоны</option>
            <option value="laptops">Ноутбуки</option>
            <option value="headphones">Наушники</option>
            <option value="tv">Телевизоры</option>
            <option value="tablets">Планшеты</option>
            <option value="accessories">Аксессуары</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Краткое описание товара..."
            rows={2}
            className="w-full p-2 border rounded resize-none"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Добавление...
            </>
          ) : (
            'Добавить товар'
          )}
        </Button>
      </form>
    </div>
  )
} 