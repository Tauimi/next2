'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, Grid, List } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { ProductCardData } from '@/types'
import { adaptProductToCard } from '@/lib/utils'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState(query)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    if (query) {
      searchProducts(query)
    } else {
      setLoading(false)
    }
  }, [query])

  const searchProducts = async (searchTerm: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // Адаптируем данные к формату ProductCardData
          const adaptedProducts = data.data.map(adaptProductToCard)
          setProducts(adaptedProducts)
        } else {
          setProducts([])
          if (data.error) {
            setError(data.error)
          }
        }
      } else {
        setError('Ошибка поиска товаров')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'rating': return (b.averageRating || 0) - (a.averageRating || 0)
      case 'name': return a.name.localeCompare(b.name)
      default: return 0 // relevance - оставляем как есть
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок и поиск */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          {query ? `Результаты поиска: "${query}"` : 'Поиск товаров'}
        </h1>
        
        {/* Форма поиска */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Найти товар..."
              className="w-full pl-10 pr-24 py-3 text-lg border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Найти
            </button>
          </div>
        </form>

        {query && (
          <p className="text-secondary-600">
            Найдено товаров: {sortedProducts.length}
          </p>
        )}
      </div>

      {error && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Ошибка</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      )}

      {!query && !loading && (
        <div className="text-center py-12">
          <div className="text-secondary-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-600 mb-2">
            Введите запрос для поиска
          </h2>
          <p className="text-secondary-500">
            Найдите нужные товары по названию, бренду или категории
          </p>
        </div>
      )}

      {query && sortedProducts.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-secondary-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-600 mb-2">
            Ничего не найдено
          </h2>
          <p className="text-secondary-500 mb-4">
            По запросу "{query}" товары не найдены
          </p>
          <div className="space-y-2 text-sm text-secondary-500">
            <p>Попробуйте:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Проверить правильность написания</li>
              <li>Использовать более общие термины</li>
              <li>Попробовать синонимы</li>
              <li>Уменьшить количество слов в запросе</li>
            </ul>
          </div>
        </div>
      )}

      {sortedProducts.length > 0 && (
        <>
          {/* Управление отображением */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-600">Сортировка:</span>
              <select 
                className="px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">По релевантности</option>
                <option value="name">По названию</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="rating">По рейтингу</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Результаты поиска */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {sortedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
} 