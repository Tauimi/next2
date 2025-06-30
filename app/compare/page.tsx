'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GitCompare, 
  ShoppingCart, 
  Trash2, 
  Star, 
  ArrowLeft, 
  Eye,
  Heart,
  Check,
  X as XIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import useCompareStore from '@/store/compare'
import useWishlistStore from '@/store/wishlist'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ComparePage() {
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const { 
    items: compareItems, 
    groupedSpecs,
    isLoading, 
    error, 
    fetchCompare, 
    removeFromCompare, 
    clearCompare 
  } = useCompareStore()
  const { toggleWishlist } = useWishlistStore()

  const [onlyDifferences, setOnlyDifferences] = useState(false)

  // Проверка авторизации
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    // Загружаем сравнение
    fetchCompare()
  }, [user, router, fetchCompare])

  const handleRemoveFromCompare = async (productId: string) => {
    try {
      const success = await removeFromCompare(productId)
      if (success) {
        toast.success('Товар удален из сравнения')
      }
    } catch (error) {
      console.error('Remove from compare error:', error)
      toast.error('Ошибка при удалении из сравнения')
    }
  }

  const handleClearCompare = async () => {
    try {
      const success = await clearCompare()
      if (success) {
        toast.success('Сравнение очищено')
      }
    } catch (error) {
      console.error('Clear compare error:', error)
      toast.error('Ошибка при очистке сравнения')
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1)
      toast.success('Товар добавлен в корзину')
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Ошибка при добавлении в корзину')
    }
  }

  const handleAddToWishlist = async (productId: string) => {
    try {
      await toggleWishlist(productId)
      toast.success('Товар добавлен в избранное')
    } catch (error) {
      console.error('Add to wishlist error:', error)
      toast.error('Ошибка при добавлении в избранное')
    }
  }

  const handleAddAllToCart = async () => {
    try {
      const availableProducts = compareItems.filter(item => item.product.inStock)
      for (const item of availableProducts) {
        await addToCart(item.productId, 1)
      }
      toast.success(`${availableProducts.length} товаров добавлено в корзину`)
    } catch (error) {
      console.error('Add all to cart error:', error)
      toast.error('Ошибка при добавлении товаров в корзину')
    }
  }

  // Фильтрация характеристик по различиям
  const getFilteredSpecs = () => {
    if (!onlyDifferences) return groupedSpecs
    
    const filtered: typeof groupedSpecs = {}
    
    Object.entries(groupedSpecs).forEach(([groupName, specs]) => {
      const filteredGroupSpecs = specs.filter(spec => {
        const values = Object.values(spec.values)
        const uniqueValues = new Set(values)
        return uniqueValues.size > 1 // Показываем только если есть различия
      })
      
      if (filteredGroupSpecs.length > 0) {
        filtered[groupName] = filteredGroupSpecs
      }
    })
    
    return filtered
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
          <p className="text-muted-foreground mb-6">Войдите в аккаунт для сравнения товаров</p>
          <Button asChild>
            <Link href="/auth/login">Войти</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка сравнения...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Ошибка</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => fetchCompare()}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  const filteredSpecs = getFilteredSpecs()

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-blue-600">Сравнение</span> товаров
            </h1>
            <p className="text-xl text-muted-foreground">
              Сравните характеристики и выберите лучший товар
            </p>
          </div>
        </div>
      </section>

      {compareItems.length > 0 ? (
        <>
          {/* Controls */}
          <section className="py-8 bg-white border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      Товаров в сравнении: {compareItems.length}
                    </span>
                    <Button
                      variant={onlyDifferences ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOnlyDifferences(!onlyDifferences)}
                    >
                      {onlyDifferences ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      Только различия
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={handleAddAllToCart}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Добавить все в корзину
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClearCompare}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Очистить сравнение
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      {/* Product Headers */}
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-6 w-48 bg-gray-50">
                            <span className="font-semibold text-gray-900">Товары</span>
                          </th>
                          {compareItems.map((item) => {
                            const product = item.product
                            const primaryImage = product.images?.[0]
                            const hasDiscount = product.originalPrice && product.originalPrice > product.price

                            return (
                              <th key={item.id} className="text-center p-6 min-w-[280px] relative">
                                {/* Remove button */}
                                <button
                                  className="absolute top-2 right-2 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 transition-colors"
                                  onClick={() => handleRemoveFromCompare(product.id)}
                                >
                                  <XIcon className="w-4 h-4" />
                                </button>

                                {/* Product Image */}
                                <Link href={`/product/${product.slug}`}>
                                  <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-lg bg-gray-100">
                                    {primaryImage ? (
                                      <Image
                                        src={primaryImage.url}
                                        alt={primaryImage.alt || product.name}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Eye className="w-8 h-8 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                </Link>

                                {/* Product Info */}
                                <div className="space-y-2">
                                  <Link href={`/product/${product.slug}`}>
                                    <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                                      {product.name}
                                    </h3>
                                  </Link>

                                  {/* Rating */}
                                  {product.averageRating > 0 && (
                                    <div className="flex items-center justify-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm">{product.averageRating}</span>
                                    </div>
                                  )}

                                  {/* Price */}
                                  <div className="space-y-1">
                                    <div className="font-bold text-lg text-blue-600">
                                      {formatPrice(product.price)}
                                    </div>
                                    {hasDiscount && (
                                      <div className="text-sm text-gray-500 line-through">
                                        {formatPrice(product.originalPrice!)}
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="space-y-2 pt-2">
                                    <Button
                                      size="sm"
                                      className="w-full"
                                      disabled={!product.inStock}
                                      onClick={() => handleAddToCart(product.id)}
                                    >
                                      <ShoppingCart className="w-4 h-4 mr-2" />
                                      В корзину
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => handleAddToWishlist(product.id)}
                                    >
                                      <Heart className="w-4 h-4 mr-2" />
                                      В избранное
                                    </Button>
                                  </div>
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>

                      {/* Specifications */}
                      <tbody>
                        {Object.entries(filteredSpecs).map(([groupName, specs]) => (
                          <React.Fragment key={groupName}>
                            {/* Group Header */}
                            <tr className="bg-gray-50">
                              <td colSpan={compareItems.length + 1} className="p-4">
                                <h4 className="font-semibold text-gray-900">{groupName}</h4>
                              </td>
                            </tr>

                            {/* Specifications */}
                            {specs.map((spec, index) => {
                              // Проверяем, есть ли различия в значениях
                              const values = Object.values(spec.values)
                              const uniqueValues = new Set(values)
                              const hasDifferences = uniqueValues.size > 1

                              return (
                                <tr 
                                  key={`${groupName}-${spec.name}-${index}`}
                                  className={`border-b ${hasDifferences ? 'bg-yellow-50' : ''}`}
                                >
                                  <td className="p-4 font-medium text-gray-900 bg-gray-50">
                                    {spec.name}
                                    {spec.unit && (
                                      <span className="text-gray-500 text-sm ml-1">
                                        ({spec.unit})
                                      </span>
                                    )}
                                  </td>
                                  {compareItems.map((item) => (
                                    <td key={item.id} className="p-4 text-center">
                                      <span className={hasDifferences ? 'font-medium' : ''}>
                                        {spec.values[item.productId] || '—'}
                                      </span>
                                    </td>
                                  ))}
                                </tr>
                              )
                            })}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Empty State */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <GitCompare className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Список сравнения пуст</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Добавьте товары в сравнение, чтобы анализировать их характеристики и выбрать лучший вариант
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4" />
                    <span>До 4 товаров</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Одна категория</span>
                  </div>
                </div>
                <Button size="lg" asChild>
                  <Link href="/catalog">Перейти в каталог</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Как пользоваться сравнением</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <GitCompare className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Добавляйте товары</h3>
                <p className="text-sm text-muted-foreground">
                  Нажмите кнопку сравнения на карточке товара
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Анализируйте</h3>
                <p className="text-sm text-muted-foreground">
                  Сравните характеристики и цены товаров
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Покупайте</h3>
                <p className="text-sm text-muted-foreground">
                  Выберите лучший товар и добавьте в корзину
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 