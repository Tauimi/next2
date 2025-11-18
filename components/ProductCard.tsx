'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye, Star, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { ProductCardData } from '@/types'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import useWishlistStore from '@/store/wishlist'
import useCompareStore from '@/store/compare'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

interface ProductCardProps {
  product: ProductCardData
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  loading?: boolean
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist,
  loading = false 
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const { user } = useAuthStore()
  const { addToCart, isLoading: cartLoading } = useCartStore()
  const { 
    isInWishlist, 
    toggleWishlist, 
    isLoading: wishlistLoading 
  } = useWishlistStore()
  const {
    isInCompare,
    toggleCompare,
    isLoading: compareLoading
  } = useCompareStore()
  const router = useRouter()
  const toast = useToast()

  const primaryImage = product.images?.[0]
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const isInUserWishlist = isInWishlist(product.id)
  const isInUserCompare = isInCompare(product.id)

  const handleAddToCart = async () => {
    if (loading || isAdding || cartLoading) return
    
    setIsAdding(true)
    
    try {
      await addToCart(product.id, 1)
      toast.success('Товар добавлен в корзину!')
    } catch (error: any) {
      console.error('Add to cart error:', error)
      if (error.message?.includes('401') || error.message?.includes('авторизации')) {
        toast.warning('Для добавления товаров в корзину необходимо войти в аккаунт')
        router.push('/auth/login')
      } else {
        toast.error(error.message || 'Ошибка при добавлении товара в корзину')
      }
    } finally {
      setIsAdding(false)
    }
    
    // Если есть callback - тоже вызываем
    if (onAddToCart) {
      onAddToCart(product.id)
    }
  }

  const handleAddToWishlist = async () => {
    // Проверяем авторизацию
    if (!user) {
      toast.warning('Для добавления в избранное необходимо войти в аккаунт')
      router.push('/auth/login')
      return
    }

    if (loading || wishlistLoading) return

    try {
      const success = await toggleWishlist(product.id)
      if (success) {
        if (isInUserWishlist) {
          toast.success('Товар удален из избранного')
        } else {
          toast.success('Товар добавлен в избранное')
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      toast.error('Ошибка при работе с избранным')
    }

    // Если есть callback - тоже вызываем
    if (onAddToWishlist && !loading) {
      onAddToWishlist(product.id)
    }
  }

  const handleAddToCompare = async () => {
    // Проверяем авторизацию
    if (!user) {
      toast.warning('Для сравнения товаров необходимо войти в аккаунт')
      router.push('/auth/login')
      return
    }

    if (loading || compareLoading) return

    try {
      const success = await toggleCompare(product.id)
      if (success) {
        if (isInUserCompare) {
          toast.success('Товар удален из сравнения')
        } else {
          toast.success('Товар добавлен к сравнению')
        }
      }
    } catch (error) {
      console.error('Compare toggle error:', error)
      toast.error('Ошибка при работе со сравнением')
    }
  }

  return (
    <motion.div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            Новинка
          </span>
        )}
        {product.isHot && (
          <span className="bg-accent-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Хит
          </span>
        )}
        {hasDiscount && (
          <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="bg-secondary-200 text-secondary-600 text-xs font-medium px-2 py-1 rounded-full">
            Нет в наличии
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        className="absolute top-3 right-3 z-10 flex flex-col gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          size="icon"
          variant="secondary"
          className={`h-8 w-8 rounded-full shadow-md transition-colors ${
            isInUserWishlist 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
          onClick={handleAddToWishlist}
          disabled={loading || wishlistLoading}
        >
          <Heart className={`h-4 w-4 ${isInUserWishlist ? 'fill-current' : ''}`} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className={`h-8 w-8 rounded-full shadow-md transition-colors ${
            isInUserCompare 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
          onClick={handleAddToCompare}
          disabled={loading || compareLoading}
        >
          <GitCompare className={`h-4 w-4 ${isInUserCompare ? 'fill-current' : ''}`} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full shadow-md"
          asChild
        >
          <Link href={`/product/${product.slug}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-48 bg-secondary-100 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className={`
                object-cover transition-all duration-300
                ${isImageLoading ? 'blur-sm' : 'blur-0'}
                ${isHovered ? 'scale-105' : 'scale-100'}
              `}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary-500">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8" />
                </div>
                <p className="text-sm">Нет изображения</p>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-secondary-500 mb-1">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.averageRating && product.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.averageRating!)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-secondary-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-secondary-500">
              ({product.totalReviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-primary-600">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-secondary-500 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.inStock || loading || isAdding || cartLoading}
          loading={loading || isAdding || cartLoading}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {!product.inStock 
            ? 'Нет в наличии' 
            : isAdding 
              ? 'Добавление...' 
                : 'В корзину'
          }
        </Button>
      </div>
    </motion.div>
  )
} 