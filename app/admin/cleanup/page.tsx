'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  isActive: boolean
  categoryId: string
  category: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export default function CleanupPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryId, setCategoryId] = useState('')

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const url = categoryId 
        ? `/api/admin/products/cleanup?categoryId=${categoryId}`
        : '/api/admin/products/cleanup'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Удалить товар "${productName}"?`)) return

    try {
      const response = await fetch(`/api/admin/products/cleanup?productId=${productId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        alert('Товар удалён')
        fetchProducts()
      } else {
        alert('Ошибка: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ошибка удаления')
    }
  }

  const deleteAllInCategory = async (catId: string, catName: string) => {
    const count = products.filter(p => p.categoryId === catId).length
    if (!confirm(`Удалить все ${count} товаров из категории "${catName}"?`)) return

    try {
      const response = await fetch(`/api/admin/products/cleanup?categoryId=${catId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        alert(`Удалено ${result.deletedCount} товаров`)
        fetchProducts()
      } else {
        alert('Ошибка: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting products:', error)
      alert('Ошибка удаления')
    }
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
              <h1 className="text-3xl font-bold">Очистка товаров</h1>
              <p className="text-muted-foreground">
                Все товары в базе данных (включая неактивные)
              </p>
            </div>
          </div>
          <Button onClick={fetchProducts} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <label className="block text-sm font-medium mb-2">
            Фильтр по категории (ID):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="cmi3fgjx10002xtyjgn72wqof"
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <Button onClick={fetchProducts}>
              Применить
            </Button>
            {categoryId && (
              <Button variant="outline" onClick={() => {
                setCategoryId('')
                setTimeout(fetchProducts, 100)
              }}>
                Сбросить
              </Button>
            )}
          </div>
        </div>

        {/* Products List */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Название</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Категория</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Статус</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Создан</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product.id} className={!product.isActive ? 'bg-red-50' : ''}>
                        <td className="px-4 py-3 text-sm font-mono text-xs">
                          {product.id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.category.name}
                          <br />
                          <span className="text-xs text-muted-foreground font-mono">
                            {product.categoryId.substring(0, 8)}...
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Активен' : 'Неактивен'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(product.createdAt).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProduct(product.id, product.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold">{products.length}</div>
                <div className="text-sm text-muted-foreground">Всего товаров</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Активных</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => !p.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Неактивных</div>
              </div>
            </div>

            {products.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-muted-foreground">Товары не найдены</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
