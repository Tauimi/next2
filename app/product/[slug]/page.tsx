'use client'

import { useState, useEffect } from 'react'
import { Star, Heart, ShoppingCart, Share2, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Product } from '@/types'
import { useAuthStore } from '@/store/auth'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  
  const { user } = useAuthStore()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (slug) {
      loadProduct()
    }
  }, [slug])

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProduct(data.data)
        } else {
          setError('Товар не найден')
        }
      } else {
        setError('Ошибка загрузки товара')
      }
    } catch (err) {
      setError('Ошибка загрузки товара')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!product) return
    
    // Проверяем авторизацию
    if (!user) {
      alert('Для добавления товаров в корзину необходимо войти в аккаунт')
      router.push('/auth/login')
      return
    }
    
    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      })

      if (response.ok) {
        // Показать уведомление об успешном добавлении
        alert(`${quantity} шт. товара "${product.name}" добавлено в корзину!`)
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при добавлении товара в корзину')
      }
    } catch (err) {
      // TODO: Добавить toast уведомление об ошибке
      alert('Ошибка при добавлении товара в корзину')
    } finally {
      setAddingToCart(false)
    }
  }

  const increaseQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

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
          <p className="text-secondary-600 mb-4">{error}</p>
          <Link href="/catalog" className="btn-primary">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const currentImage = product.images?.[selectedImage]

  return (
    <div className="container-custom py-8">
      {/* Навигационная цепочка */}
      <nav className="flex text-sm text-secondary-500 mb-8">
        <Link href="/" className="hover:text-primary-600">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-primary-600">Каталог</Link>
        <span className="mx-2">/</span>
        <span className="text-secondary-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Изображения товара */}
        <div className="space-y-4">
          {/* Основное изображение */}
          <div className="aspect-square bg-secondary-100 rounded-lg overflow-hidden">
            {currentImage?.url ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="h-24 w-24 text-secondary-300" />
              </div>
            )}
          </div>

          {/* Миниатюры */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-secondary-200'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="space-y-6">
          {/* Заголовок и рейтинг */}
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-secondary-300'
                    }`}
                  />
                ))}
                                 <span className="text-sm text-secondary-600 ml-2">
                   {product.averageRating.toFixed(1)} ({product.totalReviews} отзывов)
                 </span>
              </div>
            </div>

            <p className="text-secondary-600">
              Артикул: {product.sku}
            </p>
          </div>

          {/* Цена */}
          <div className="border-y border-secondary-200 py-6">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl font-bold text-secondary-900">
                {product.price.toLocaleString()} ₽
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-secondary-400 line-through">
                  {product.originalPrice.toLocaleString()} ₽
                </span>
              )}
            </div>
            
            {product.discount && (
              <span className="inline-block bg-accent-500 text-white text-sm px-2 py-1 rounded">
                Скидка {product.discount}%
              </span>
            )}
          </div>

          {/* Наличие */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={product.inStock ? 'text-green-700' : 'text-red-700'}>
              {product.inStock ? `В наличии (${product.stockQuantity} шт.)` : 'Нет в наличии'}
            </span>
          </div>

          {/* Количество и добавление в корзину */}
          {product.inStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Количество:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-100 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-12 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stockQuantity}
                    className="w-10 h-10 rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-100 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className="btn-primary flex-1"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {addingToCart 
                    ? 'Добавление...' 
                    : !user 
                      ? 'Войти для покупки' 
                      : 'В корзину'
                  }
                </button>
                
                <button 
                  className="btn-secondary p-3"
                  onClick={() => {
                    if (!user) {
                      alert('Для добавления в избранное необходимо войти в аккаунт')
                      router.push('/auth/login')
                      return
                    }
                    // TODO: Добавить функциональность избранного
                    alert('Функция избранного будет добавлена позже')
                  }}
                >
                  <Heart className="h-5 w-5" />
                </button>
                
                <button className="btn-secondary p-3">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Гарантии */}
          <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary-600" />
              <span className="text-sm">Бесплатная доставка от 5000 ₽</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary-600" />
              <span className="text-sm">Гарантия производителя</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary-600" />
              <span className="text-sm">Возврат в течение 14 дней</span>
            </div>
          </div>
        </div>
      </div>

      {/* Описание и характеристики */}
      <div className="mt-16 space-y-8">
        {/* Описание */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Описание</h2>
          <div className="prose max-w-none text-secondary-700">
            <p>{product.description}</p>
          </div>
        </div>

        {/* Характеристики */}
        {product.specifications && product.specifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Характеристики</h2>
            <div className="card">
              <div className="space-y-3">
                {product.specifications.map(spec => (
                  <div key={spec.id} className="flex justify-between py-2 border-b border-secondary-100 last:border-0">
                    <span className="text-secondary-600 font-medium">{spec.name}</span>
                    <span className="text-secondary-900">
                      {spec.value} {spec.unit ? spec.unit : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 