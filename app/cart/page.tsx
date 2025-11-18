'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'

export default function CartPage() {
  const { items: cartItems, totalItems, totalAmount, removeItem, updateQuantity, clearCart, isLoading, fetchCart } = useCartStore()
  const [error, setError] = useState('')

  // Загружаем корзину при загрузке страницы
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  if (isLoading) {
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
          <Link href="/" className="btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <div className="text-secondary-300 mb-6">
            <ShoppingBag className="h-24 w-24 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Корзина пуста
          </h1>
          <p className="text-secondary-600 mb-8">
            Добавьте товары в корзину, чтобы оформить заказ
          </p>
          <div className="space-x-4">
            <Link href="/catalog" className="btn-primary">
              Перейти к покупкам
            </Link>
            <Link href="/" className="btn-secondary">
              На главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Корзина</h1>
        <p className="text-secondary-600">
          {totalItems} товар(ов) на сумму {totalAmount.toLocaleString()} ₽
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="card">
              <div className="flex items-center gap-4">
                {/* Изображение товара */}
                <div className="w-20 h-20 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images?.[0]?.url ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.images[0].alt || item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary-200 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-secondary-400" />
                    </div>
                  )}
                </div>

                {/* Информация о товаре */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary-900 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {item.product.price.toLocaleString()} ₽ за штуку
                  </p>
                  {!item.product.inStock && (
                    <p className="text-sm text-red-600">Нет в наличии</p>
                  )}
                </div>

                {/* Количество */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-100"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-12 text-center font-medium">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-secondary-300 flex items-center justify-center hover:bg-secondary-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Общая стоимость */}
                <div className="text-right min-w-0">
                  <p className="font-semibold text-secondary-900">
                    {(item.product.price * item.quantity).toLocaleString()} ₽
                  </p>
                </div>

                {/* Кнопка удаления */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Очистить корзину */}
          <div className="pt-4">
            <button
              onClick={clearCart}
              className="text-sm text-secondary-500 hover:text-red-600"
            >
              Очистить корзину
            </button>
          </div>
        </div>

        {/* Итоги заказа */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Итог заказа</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-secondary-600">Товары ({totalItems})</span>
                <span className="font-medium">{totalAmount.toLocaleString()} ₽</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary-600">Доставка</span>
                <span className="font-medium text-green-600">Бесплатно</span>
              </div>
              
              <hr className="border-secondary-200" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Итого</span>
                <span>{totalAmount.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center">
                Оформить заказ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              
              <Link href="/catalog" className="btn-secondary w-full text-center block">
                Продолжить покупки
              </Link>
            </div>

            <div className="mt-6 text-sm text-secondary-500">
              <p>• Бесплатная доставка от 5000 ₽</p>
              <p>• Гарантия на все товары</p>
              <p>• Возврат в течение 14 дней</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 