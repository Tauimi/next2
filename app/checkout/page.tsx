'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Truck, CreditCard, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { ValidatedTextarea } from '@/components/ui/ValidatedTextarea'
import { validateEmail, validatePhone, validateName, validateAddress, validateCity, validateZipCode, formatPhone } from '@/lib/validation'

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
  paymentMethod: string
  shippingMethod: string
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
  
  // Состояние валидации
  const [validationState, setValidationState] = useState({
    customerName: false,
    customerEmail: false,
    customerPhone: false,
    street: false,
    city: false,
    zipCode: false
  })
  
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
    notes: '',
    paymentMethod: 'CASH',
    shippingMethod: 'COURIER'
  })

  // Автосохранение формы в localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem('checkout-form')
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm)
        setFormData(prev => ({
          ...prev,
          ...parsed,
          customerEmail: user?.email || parsed.customerEmail,
          customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : parsed.customerName
        }))
      } catch (e) {
        console.error('Error loading saved form:', e)
      }
    }
  }, [user])

  // Сохранение формы при изменении
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('checkout-form', JSON.stringify(formData))
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData])

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
    // Проверяем все поля через наши валидаторы
    const nameValid = validateName(formData.customerName, 'Имя')
    const emailValid = validateEmail(formData.customerEmail)
    const phoneValid = validatePhone(formData.customerPhone)
    const streetValid = validateAddress(formData.shippingAddress.street)
    const cityValid = validateCity(formData.shippingAddress.city)
    const zipValid = validateZipCode(formData.shippingAddress.zipCode)

    if (!nameValid.isValid) {
      setError(nameValid.error || 'Проверьте имя')
      return false
    }
    
    if (!emailValid.isValid) {
      setError(emailValid.error || 'Проверьте email')
      return false
    }
    
    if (!phoneValid.isValid) {
      setError(phoneValid.error || 'Проверьте телефон')
      return false
    }
    
    if (!streetValid.isValid) {
      setError(streetValid.error || 'Проверьте адрес')
      return false
    }
    
    if (!cityValid.isValid) {
      setError(cityValid.error || 'Проверьте город')
      return false
    }
    
    if (!zipValid.isValid) {
      setError(zipValid.error || 'Проверьте индекс')
      return false
    }

    setError('')
    return true
  }
  
  // Проверка валидности шага 1
  const isStep1Valid = validationState.customerName && validationState.customerEmail && validationState.customerPhone
  
  // Проверка валидности шага 2
  const isStep2Valid = validationState.street && validationState.city && validationState.zipCode

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
      localStorage.removeItem('checkout-form') // Очищаем сохраненную форму
      setCurrentStep(6) // Шаг успеха
      toast.success('Заказ успешно оформлен!')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания заказа'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Расчет стоимости доставки в зависимости от способа
  const calculateShippingCost = () => {
    if (formData.shippingMethod === 'COURIER') {
      return totalAmount >= 50000 ? 0 : 1000
    } else if (formData.shippingMethod === 'PICKUP') {
      return 0
    } else if (formData.shippingMethod === 'POST') {
      return 500
    } else if (formData.shippingMethod === 'CDEK' || formData.shippingMethod === 'BOXBERRY') {
      return 700
    }
    return 0
  }

  const shippingCost = calculateShippingCost()
  const finalTotal = totalAmount + shippingCost

  // Способы доставки
  const shippingMethods = [
    { 
      id: 'COURIER', 
      name: 'Курьерская доставка', 
      description: 'Доставка по адресу',
      cost: totalAmount >= 50000 ? 0 : 1000,
      time: '1-2 дня'
    },
    { 
      id: 'PICKUP', 
      name: 'Самовывоз', 
      description: 'Забрать из магазина',
      cost: 0,
      time: 'Сегодня'
    },
    { 
      id: 'POST', 
      name: 'Почта России', 
      description: 'Доставка почтой',
      cost: 500,
      time: '5-7 дней'
    },
    { 
      id: 'CDEK', 
      name: 'СДЭК', 
      description: 'Пункт выдачи СДЭК',
      cost: 700,
      time: '2-3 дня'
    },
    { 
      id: 'BOXBERRY', 
      name: 'Boxberry', 
      description: 'Пункт выдачи Boxberry',
      cost: 700,
      time: '2-3 дня'
    }
  ]

  // Способы оплаты
  const paymentMethods = [
    { 
      id: 'CASH', 
      name: 'Наличные при получении', 
      description: 'Оплата курьеру или в пункте выдачи',
      icon: '💵'
    },
    { 
      id: 'CARD_COURIER', 
      name: 'Картой курьеру', 
      description: 'Оплата картой при получении',
      icon: '💳'
    },
    { 
      id: 'CARD_ONLINE', 
      name: 'Онлайн оплата', 
      description: 'Оплата картой на сайте',
      icon: '🌐'
    },
    { 
      id: 'BANK_TRANSFER', 
      name: 'Банковский перевод', 
      description: 'Оплата по реквизитам',
      icon: '🏦'
    },
    { 
      id: 'SBP', 
      name: 'СБП', 
      description: 'Система быстрых платежей',
      icon: '⚡'
    }
  ]

  const steps = [
    { number: 1, title: 'Контактные данные', icon: Package },
    { number: 2, title: 'Адрес доставки', icon: MapPin },
    { number: 3, title: 'Доставка', icon: Truck },
    { number: 4, title: 'Оплата', icon: CreditCard },
    { number: 5, title: 'Подтверждение', icon: CheckCircle },
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
                  <ValidatedInput
                    label="Полное имя"
                    type="text"
                    value={formData.customerName}
                    onChange={(value) => updateFormData('customerName', value)}
                    placeholder="Иван Иванов"
                    validationRules={{
                      required: true,
                      minLength: 2,
                      maxLength: 100,
                      pattern: /[а-яА-ЯёЁa-zA-Z]/,
                      message: 'Имя должно содержать минимум 2 символа'
                    }}
                    onValidationChange={(result) => 
                      setValidationState(prev => ({ ...prev, customerName: result.isValid }))
                    }
                  />
                  
                  <ValidatedInput
                    label="Email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(value) => updateFormData('customerEmail', value)}
                    placeholder="ivan@example.com"
                    validationRules={{
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Введите корректный email адрес'
                    }}
                    onValidationChange={(result) => 
                      setValidationState(prev => ({ ...prev, customerEmail: result.isValid }))
                    }
                  />
                  
                  <ValidatedInput
                    label="Телефон"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(value) => {
                      const formatted = formatPhone(value)
                      updateFormData('customerPhone', formatted)
                    }}
                    placeholder="+7 (900) 123-45-67"
                    validationRules={{
                      required: true,
                      minLength: 11,
                      message: 'Введите корректный номер телефона (11 цифр)'
                    }}
                    onValidationChange={(result) => 
                      setValidationState(prev => ({ ...prev, customerPhone: result.isValid }))
                    }
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!isStep1Valid}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <ValidatedInput
                    label="Улица, дом, квартира"
                    type="text"
                    value={formData.shippingAddress.street}
                    onChange={(value) => updateShippingAddress('street', value)}
                    placeholder="ул. Примерная, д. 1, кв. 10"
                    validationRules={{
                      required: true,
                      minLength: 5,
                      maxLength: 200,
                      message: 'Адрес должен содержать минимум 5 символов'
                    }}
                    onValidationChange={(result) => 
                      setValidationState(prev => ({ ...prev, street: result.isValid }))
                    }
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput
                      label="Город"
                      type="text"
                      value={formData.shippingAddress.city}
                      onChange={(value) => updateShippingAddress('city', value)}
                      placeholder="Москва"
                      validationRules={{
                        required: true,
                        minLength: 2,
                        pattern: /^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
                        message: 'Название города должно содержать только буквы'
                      }}
                      onValidationChange={(result) => 
                        setValidationState(prev => ({ ...prev, city: result.isValid }))
                      }
                    />
                    
                    <ValidatedInput
                      label="Почтовый индекс"
                      type="text"
                      value={formData.shippingAddress.zipCode}
                      onChange={(value) => {
                        const digitsOnly = value.replace(/\D/g, '').slice(0, 6)
                        updateShippingAddress('zipCode', digitsOnly)
                      }}
                      placeholder="123456"
                      validationRules={{
                        required: true,
                        minLength: 6,
                        maxLength: 6,
                        pattern: /^\d{6}$/,
                        message: 'Почтовый индекс должен содержать 6 цифр'
                      }}
                      onValidationChange={(result) => 
                        setValidationState(prev => ({ ...prev, zipCode: result.isValid }))
                      }
                    />
                  </div>
                  
                  <ValidatedTextarea
                    label="Комментарий к заказу"
                    value={formData.notes}
                    onChange={(value) => updateFormData('notes', value)}
                    rows={3}
                    placeholder="Дополнительная информация для курьера..."
                    validationRules={{
                      required: false,
                      maxLength: 500
                    }}
                    showCharCount
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!isStep2Valid}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 3: Способ доставки */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-6">Способ доставки</h2>
                
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.shippingMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={formData.shippingMethod === method.id}
                          onChange={(e) => updateFormData('shippingMethod', e.target.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                          <div className="text-sm text-muted-foreground">Срок: {method.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {method.cost === 0 ? 'Бесплатно' : `${method.cost} ₽`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 4: Способ оплаты */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-6">Способ оплаты</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <span>{method.icon}</span>
                            {method.name}
                          </div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 5: Подтверждение */}
            {currentStep === 5 && (
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

                  {/* Способ доставки */}
                  <div>
                    <h3 className="font-medium mb-3">Способ доставки</h3>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p className="font-medium">
                        {shippingMethods.find(m => m.id === formData.shippingMethod)?.name}
                      </p>
                      <p className="text-muted-foreground">
                        {shippingMethods.find(m => m.id === formData.shippingMethod)?.description}
                      </p>
                      <p className="mt-1">
                        Стоимость: {shippingCost === 0 ? 'Бесплатно' : `${shippingCost} ₽`}
                      </p>
                    </div>
                  </div>

                  {/* Способ оплаты */}
                  <div>
                    <h3 className="font-medium mb-3">Способ оплаты</h3>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p className="font-medium flex items-center gap-2">
                        <span>{paymentMethods.find(m => m.id === formData.paymentMethod)?.icon}</span>
                        {paymentMethods.find(m => m.id === formData.paymentMethod)?.name}
                      </p>
                      <p className="text-muted-foreground">
                        {paymentMethods.find(m => m.id === formData.paymentMethod)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={createOrder}
                    disabled={loading}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                    {loading ? 'Оформление...' : 'Оформить заказ'}
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 6: Успех */}
            {currentStep === 6 && orderId && (
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
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Мои заказы
                  </button>
                  <button
                    onClick={() => router.push('/catalog')}
                    className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Продолжить покупки
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Сводка заказа */}
          {currentStep <= 5 && (
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