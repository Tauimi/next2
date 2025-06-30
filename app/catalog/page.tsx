'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { ProductCardData, Category, Brand } from '@/types'
import { adaptProductToCard } from '@/lib/utils'

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Загружаем товары
      const productsRes = await fetch('/api/products')
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        const adaptedProducts = productsData.success ? 
          productsData.data.map(adaptProductToCard) : []
        setProducts(adaptedProducts)
      }

      // Загружаем категории
      const categoriesRes = await fetch('/api/categories')
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.success ? categoriesData.data : [])
      }

      setLoading(false)
    } catch (err) {
      setError('Ошибка загрузки данных')
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory
    const matchesBrand = !selectedBrand || product.brand?.name === selectedBrand
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice
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
      <div className="container-custom py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка</h1>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Каталог товаров</h1>
        <p className="text-secondary-600">Найдено товаров: {sortedProducts.length}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Фильтры */}
        <aside className="lg:w-1/4">
          <div className="card space-y-6">
            <h2 className="text-xl font-semibold">Фильтры</h2>

            {/* Поиск */}
            <div>
              <label className="block text-sm font-medium mb-2">Поиск</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Найти товар..."
                  className="input pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Категории */}
            <div>
              <label className="block text-sm font-medium mb-2">Категория</label>
              <select 
                className="input w-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                className="input w-full"
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
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Товары */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-secondary-400 mb-4">
                <Filter className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-600 mb-2">
                Товары не найдены
              </h3>
              <p className="text-secondary-500">
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
  )
} 