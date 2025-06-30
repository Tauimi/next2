'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Eye, Package, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  category: {
    name: string
  }
  brand?: {
    name: string
  }
  inStock: boolean
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (statusFilter === 'active') return matchesSearch && product.isActive
    if (statusFilter === 'inactive') return matchesSearch && !product.isActive
    if (statusFilter === 'outOfStock') return matchesSearch && !product.inStock
    if (statusFilter === 'featured') return matchesSearch && product.isFeatured
    
    return matchesSearch
  })

  const toggleProductStatus = async (productId: number, currentStatus: boolean) => {
    try {
      // TODO: Создать API endpoint для обновления статуса товара
      console.log(`Toggle product ${productId} status from ${currentStatus} to ${!currentStatus}`)
      // После успешного обновления, обновляем локальное состояние
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, isActive: !currentStatus }
          : product
      ))
    } catch (error) {
      console.error('Error updating product status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Загрузка товаров...</p>
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
              <h1 className="text-3xl font-bold">Товары</h1>
              <p className="text-muted-foreground">
                Всего товаров: {products.length} | Показано: {filteredProducts.length}
              </p>
            </div>
          </div>
          <Link href="/admin/products/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить товар
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Поиск по названию или категории..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Все товары</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
              <option value="outOfStock">Нет в наличии</option>
              <option value="featured">Рекомендуемые</option>
            </select>

            <Button onClick={fetchProducts} variant="outline">
              Обновить
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Товар</th>
                  <th className="text-left p-4 font-medium">Категория</th>
                  <th className="text-left p-4 font-medium">Цена</th>
                  <th className="text-left p-4 font-medium">Наличие</th>
                  <th className="text-left p-4 font-medium">Статус</th>
                  <th className="text-center p-4 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'Товары не найдены' 
                        : 'Товары не добавлены'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-muted/20">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.brand?.name && `${product.brand.name} • `}
                            Создан: {new Date(product.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-muted px-2 py-1 rounded text-sm">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{product.price.toLocaleString()} ₽</div>
                          {product.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {product.originalPrice.toLocaleString()} ₽
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            product.inStock ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm">
                            {product.inStock ? `${product.stockQuantity} шт.` : 'Нет в наличии'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => toggleProductStatus(product.id, product.isActive)}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              product.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } transition-colors`}
                          >
                            {product.isActive ? 'Активен' : 'Неактивен'}
                          </button>
                          {product.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Рекомендуемый
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/product/${product.slug}`}>
                            <Button size="sm" variant="outline" title="Просмотр">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" title="Редактировать">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Удалить">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        {products.length > 0 && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Активные</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {products.filter(p => p.isFeatured).length}
                </div>
                <div className="text-sm text-muted-foreground">Рекомендуемые</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {products.filter(p => !p.inStock).length}
                </div>
                <div className="text-sm text-muted-foreground">Нет в наличии</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {products.reduce((total, p) => total + p.stockQuantity, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Всего на складе</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 