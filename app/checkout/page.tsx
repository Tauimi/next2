'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Truck, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

interface ShippingAddress {
  street: string
  city: string
  zipCode: string
  country?: string
}

interface OrderFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const toast = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    shippingAddress: {
      street: '',
      city: '',
      zipCode: '',
      country: 'Россия'
    },
    notes: ''
  })

  // Проверяем корзину при загрузке
  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.push('/cart')
    }
  }, [items.length, router, orderId])

  // Обновление полей формы
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateShippingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }))
  }

  // Валидация формы
  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) {
      setError('Введите ваше имя')
      return false
    }
    
    if (!formData.customerEmail.trim()) {
      setError('Введите email')
      return false
    }
    
    if (!formData.customerPhone.trim()) {
      setError('Введите номер телефона')
      return false
    }
    
    if (!formData.shippingAddress.street.trim()) {
      setError('Введите адрес доставки')
      return false
    }
    
    if (!formData.shippingAddress.city.trim()) {
      setError('Введите город')
      return false
    }
    
    if (!formData.shippingAddress.zipCode.trim()) {
      setError('Введите почтовый индекс')
      return false
    }

    setError('')
    return true
  }

  // Создание заказа
  const createOrder = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка создания заказа')
      }

      setOrderId(result.data.id)
      clearCart()
      setCurrentStep(4) // Шаг подтверждения
      toast.success('Заказ успешно оформлен!')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания заказа'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Расчет стоимости доставки
  const shippingCost = totalAmount >= 50000 ? 0 : 1000
  const finalTotal = totalAmount + shippingCost

  const steps = [
    { number: 1, title: 'Контактные данные', icon: Package },
    { number: 2, title: 'Адрес доставки', icon: Truck },
    { number: 3, title: 'Подтверждение', icon: CreditCard },
    { number: 4, title: 'Готово', icon: CheckCircle },
  ]

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Корзина пуста</h2>
          <p className="text-muted-foreground mb-6">
            Добавьте товары в корзину перед оформлением заказа
          </p>
          <button
            onClick={() => router.push('/catalog')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Перейти к покупкам
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Заголовок */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold">Оформление заказа</h1>
        </div>

        {/* Прогресс */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-primary border-primary text-white' 
                          : 'border-muted-foreground text-muted-foreground'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm mt-2 ${isActive ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-muted'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Форма */}
          <div className="lg:col-span-2">
            {/* Шаг 1: Контактные данные */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-6">Контактные данные</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Полное имя *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => updateFormData('customerName', e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => updateFormData('customerEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="ivan@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => updateFormData('customerPhone', e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="+7 (900) 123-45-67"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.customerName || !formData.customerEmail || !formData.customerPhone}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 2: Адрес доставки */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-6">Адрес доставки</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Улица, дом, квартира *
                    </label>
                    <input
                      type="text"
                      value={formData.shippingAddress.street}
                      onChange={(e) => updateShippingAddress('street', e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="ул. Примерная, д. 1, кв. 10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Город *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.city}
                        onChange={(e) => updateShippingAddress('city', e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Москва"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Почтовый индекс *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.zipCode}
                        onChange={(e) => updateShippingAddress('zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Комментарий к заказу
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => updateFormData('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Дополнительная информация для курьера..."
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="border border-input px-6 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.shippingAddress.street || !formData.shippingAddress.city || !formData.shippingAddress.zipCode}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 3: Подтверждение */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-6">Подтверждение заказа</h2>
                
                <div className="space-y-6">
                  {/* Контактные данные */}
                  <div>
                    <h3 className="font-medium mb-3">Контактные данные</h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                      <p><span className="font-medium">Имя:</span> {formData.customerName}</p>
                      <p><span className="font-medium">Email:</span> {formData.customerEmail}</p>
                      <p><span className="font-medium">Телефон:</span> {formData.customerPhone}</p>
                    </div>
                  </div>

                  {/* Адрес доставки */}
                  <div>
                    <h3 className="font-medium mb-3">Адрес доставки</h3>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p>{formData.shippingAddress.street}</p>
                      <p>{formData.shippingAddress.city}, {formData.shippingAddress.zipCode}</p>
                      {formData.notes && (
                        <p className="mt-2"><span className="font-medium">Комментарий:</span> {formData.notes}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="border border-input px-6 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={createOrder}
                    disabled={loading}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                    {loading ? 'Оформление...' : 'Оформить заказ'}
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 4: Успех */}
            {currentStep === 4 && orderId && (
              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Заказ успешно оформлен!</h2>
                <p className="text-muted-foreground mb-6">
                  Мы отправили подтверждение на ваш email. 
                  В ближайшее время с вами свяжется наш менеджер.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push('/orders')}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Мои заказы
                  </button>
                  <button
                    onClick={() => router.push('/catalog')}
                    className="border border-input px-6 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    Продолжить покупки
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Сводка заказа */}
          {currentStep <= 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-8">
                <h3 className="text-xl font-semibold mb-4">Ваш заказ</h3>
                
                                 {/* Товары */}
                 <div className="space-y-4 mb-6">
                   {items.map((item) => (
                     <div key={item.productId} className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                         <Package className="h-6 w-6 text-muted-foreground" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-medium truncate">{item.product.name}</p>
                         <p className="text-sm text-muted-foreground">
                           {item.quantity} × {formatPrice(item.product.price)}
                         </p>
                       </div>
                       <p className="font-semibold">
                         {formatPrice(item.product.price * item.quantity)}
                       </p>
                     </div>
                   ))}
                 </div>

                {/* Расчеты */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Товары:</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>{shippingCost === 0 ? 'Бесплатно' : formatPrice(shippingCost)}</span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-sm text-green-600">
                      🎉 Бесплатная доставка от 50 000 ₽
                    </p>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Итого:</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 