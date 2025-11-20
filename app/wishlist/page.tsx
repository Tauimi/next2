'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, Star, Share2, Eye, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import useWishlistStore from '@/store/wishlist'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function WishlistPage() {
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const { 
    items: wishlistItems, 
    isLoading, 
    error, 
    fetchWishlist, 
    removeFromWishlist, 
    clearWishlist 
  } = useWishlistStore()

  const [selectedCategory, setSelectedCategory] = useState('Все товары')
  const [selectedBrand, setSelectedBrand] = useState('Все бренды')

  // Проверка авторизации
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    // Загружаем wishlist
    fetchWishlist()
  }, [user, router, fetchWishlist])

  // Фильтрация товаров
  const filteredItems = wishlistItems.filter(item => {
    const categoryName = item.product.category?.name || 'Без категории'
    const brandName = item.product.brand?.name
    
    const categoryMatch = selectedCategory === 'Все товары' || categoryName === selectedCategory
    const brandMatch = selectedBrand === 'Все бренды' || brandName === selectedBrand
    return categoryMatch && brandMatch
  })

  // Получение уникальных категорий и брендов с проверкой на null/undefined
  const categories = [
    'Все товары', 
    ...Array.from(new Set(
      wishlistItems
        .map(item => item.product.category?.name || 'Без категории')
        .filter(Boolean)
    ))
  ]
  
  const brands = [
    'Все бренды', 
    ...Array.from(new Set(
      wishlistItems
        .map(item => item.product.brand?.name)
        .filter(Boolean)
    ))
  ]

  // Статистика
  const totalItems = filteredItems.length
  const totalValue = filteredItems.reduce((sum, item) => sum + item.product.price, 0)
  const availableItems = filteredItems.filter(item => item.product.inStock).length
  const discountItems = filteredItems.filter(item => item.product.discount && item.product.discount > 0).length

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const success = await removeFromWishlist(productId)
      if (success) {
        toast.success('Товар удален из избранного')
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error)
      toast.error('Ошибка при удалении из избранного')
    }
  }

  const handleClearWishlist = async () => {
    try {
      const success = await clearWishlist()
      if (success) {
        toast.success('Избранное очищено')
      }
    } catch (error) {
      console.error('Clear wishlist error:', error)
      toast.error('Ошибка при очистке избранного')
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

  const handleAddAllToCart = async () => {
    try {
      const availableProducts = filteredItems.filter(item => item.product.inStock)
      for (const item of availableProducts) {
        await addToCart(item.productId, 1)
      }
      toast.success(`${availableProducts.length} товаров добавлено в корзину`)
    } catch (error) {
      console.error('Add all to cart error:', error)
      toast.error('Ошибка при добавлении товаров в корзину')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Мой список избранного - TechnoMart',
        text: `Посмотрите на мой список избранных товаров в TechnoMart (${totalItems} товаров)`,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Ссылка скопирована в буфер обмена')
      } catch (clipError) {
        toast.error('Не удалось поделиться ссылкой')
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
          <p className="text-muted-foreground mb-6">Войдите в аккаунт для просмотра избранного</p>
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
          <p>Загрузка избранного...</p>
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
          <Button onClick={() => fetchWishlist()}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
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
              Мое <span className="text-primary">избранное</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Сохраненные товары для будущих покупок
            </p>
          </div>
        </div>
      </section>

      {totalItems > 0 && (
        <>
          {/* Stats */}
          <section className="py-8 bg-white border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {totalItems}
                    </div>
                    <div className="text-sm text-muted-foreground">Товаров в избранном</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {formatPrice(totalValue)}
                    </div>
                    <div className="text-sm text-muted-foreground">Общая стоимость</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {availableItems}
                    </div>
                    <div className="text-sm text-muted-foreground">В наличии</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {discountItems}
                    </div>
                    <div className="text-sm text-muted-foreground">Со скидкой</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Filters & Actions */}
          <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={category === selectedCategory ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Поделиться
                    </Button>
                    {availableItems > 0 && (
                      <Button variant="outline" size="sm" onClick={handleAddAllToCart}>
                        Добавить все в корзину
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleClearWishlist}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Очистить все
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Wishlist Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const product = item.product
                  const primaryImage = product.images?.[0]
                  const hasDiscount = product.originalPrice && product.originalPrice > product.price
                  const categoryName = product.category?.name || 'Без категории'
                  const brandName = product.brand?.name || 'Без бренда'

                  return (
                    <motion.div 
                      key={item.id} 
                      className="bg-white rounded-lg p-6 relative group hover:shadow-lg transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Remove button */}
                      <button 
                        className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>

                      {/* Discount badge */}
                      {hasDiscount && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          -{product.discount}%
                        </div>
                      )}

                      {/* Product image */}
                      <Link href={`/product/${product.slug}`}>
                        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-secondary-100">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt || product.name}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Eye className="w-12 h-12 text-secondary-400" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product info */}
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {brandName} • {categoryName}
                          </div>
                          <Link href={`/product/${product.slug}`}>
                            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                        </div>

                        {/* Rating */}
                        {product.averageRating && product.averageRating > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium ml-1">{product.averageRating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({product.totalReviews} отзывов)
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">
                              {formatPrice(product.price)}
                            </span>
                            {hasDiscount && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.originalPrice!)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            product.inStock 
                              ? 'text-green-600' 
                              : 'text-amber-600'
                          }`}>
                            {product.inStock ? 'В наличии' : 'Нет в наличии'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Добавлено {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            className="flex-1" 
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            В корзину
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleRemoveFromWishlist(product.id)}
                          >
                            <Heart className="w-4 h-4 fill-current text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  {wishlistItems.length === 0 
                    ? 'Ваш список избранного пуст' 
                    : 'Нет товаров в выбранной категории'
                  }
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {wishlistItems.length === 0 
                    ? 'Добавляйте товары в избранное, чтобы не потерять их и купить позже'
                    : 'Попробуйте изменить фильтры или очистить их'
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/catalog">Перейти в каталог</Link>
                  </Button>
                  {wishlistItems.length > 0 && (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedCategory('Все товары')
                        setSelectedBrand('Все бренды')
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {totalItems > 0 && (
        <section className="py-12 section-gradient">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Готовы к покупке?</h2>
              <p className="text-lg mb-6 opacity-90">
                Добавьте товары из избранного в корзину и оформите заказ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {availableItems > 0 && (
                  <Button size="lg" variant="secondary" onClick={handleAddAllToCart}>
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Добавить все в корзину
                  </Button>
                )}
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/catalog">Продолжить покупки</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
} 