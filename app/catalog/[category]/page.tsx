'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/Button'
import { ProductCardData, Category } from '@/types'
import { adaptProductToCard } from '@/lib/utils'

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params?.category as string
  
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (categorySlug) {
      loadData()
    }
  }, [categorySlug])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Загружаем товары категории
      const productsRes = await fetch(`/api/products?category=${categorySlug}`)
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        const adaptedProducts = productsData.success ? 
          productsData.data.map(adaptProductToCard) : []
        setProducts(adaptedProducts)
      }

      // Загружаем информацию о категории
      const categoriesRes = await fetch('/api/categories')
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) {
          const foundCategory = categoriesData.data.find((cat: Category) => cat.slug === categorySlug)
          setCategory(foundCategory || null)
        }
      }

      setLoading(false)
    } catch (err) {
      setError('Ошибка загрузки данных')
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    return matchesSearch && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'rating': return (b.averageRating || 0) - (a.averageRating || 0)
      case 'popular': return (b.totalReviews || 0) - (a.totalReviews || 0)
      default: return a.name.localeCompare(b.name)
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-muted/50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Главная
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/catalog" className="text-muted-foreground hover:text-primary">
              Каталог
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">
              {category?.name || categorySlug}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к каталогу
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            {category?.name || 'Категория'}
          </h1>
          <p className="text-muted-foreground">
            Найдено товаров: {sortedProducts.length}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Фильтры */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <h2 className="text-xl font-semibold">Фильтры</h2>

              {/* Поиск */}
              <div>
                <label className="block text-sm font-medium mb-2">Поиск</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Найти товар..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Цена */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Сортировка */}
              <div>
                <label className="block text-sm font-medium mb-2">Сортировка</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">По названию</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="rating">По рейтингу</option>
                  <option value="popular">По популярности</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Список товаров */}
          <main className="lg:w-3/4">
            {/* Переключатель вида */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Товары */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  Товары не найдены
                </h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
} 