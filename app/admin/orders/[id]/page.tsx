'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { ValidatedTextarea } from '@/components/ui/ValidatedTextarea'

interface OrderDetails {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  paymentStatus: string
  totalAmount: number
  shippingCost: number
  tax: number
  discount: number
  subtotal: number
  trackingNumber?: string
  notes?: string
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    totalPrice: number
    product: {
      id: string
      name: string
      slug: string
      images: Array<{
        url: string
        alt: string
      }>
    }
  }>
  user?: {
    email: string
    firstName?: string
    lastName?: string
  }
}

const statusOptions = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'confirmed', label: 'Подтверждён' },
  { value: 'processing', label: 'В обработке' },
  { value: 'shipped', label: 'Отправлен' },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'cancelled', label: 'Отменён' },
  { value: 'refunded', label: 'Возврат' },
]

const paymentStatusOptions = [
  { value: 'pending', label: 'Ожидает оплаты' },
  { value: 'paid', label: 'Оплачен' },
  { value: 'failed', label: 'Ошибка оплаты' },
  { value: 'refunded', label: 'Возврат' },
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    status: '',
    paymentStatus: '',
    trackingNumber: '',
    notes: ''
  })

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Order not found')
      }

      setOrder(data.data)
      setFormData({
        status: data.data.status,
        paymentStatus: data.data.paymentStatus,
        trackingNumber: data.data.trackingNumber || '',
        notes: data.data.notes || ''
      })
    } catch (error) {
      console.error('Error fetching order:', error)
      setError(error instanceof Error ? error.message : 'Ошибка загрузки заказа')
    }
    setIsLoading(false)
  }

  const handleUpdate = async () => {
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update order')
      }

      setSuccess('Заказ успешно обновлён')
      fetchOrder()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка обновления заказа')
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ошибка</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/admin/orders">
            <Button>Вернуться к списку заказов</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!order) return null

  return (
    <main className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Заказ #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Создан {new Date(order.createdAt).toLocaleString('ru-RU')}
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Товары в заказе
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt || item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link 
                        href={`/product/${item.product.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toLocaleString()} ₽ × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.totalPrice.toLocaleString()} ₽</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between">
                  <span>Товары:</span>
                  <span>{order.subtotal.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span>{order.shippingCost.toLocaleString()} ₽</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка:</span>
                    <span>-{order.discount.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Итого:</span>
                  <span>{order.totalAmount.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Информация о клиенте
              </h2>
              <div className="space-y-2">
                <p><span className="font-medium">Имя:</span> {order.customerName}</p>
                <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                <p><span className="font-medium">Телефон:</span> {order.customerPhone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Адрес доставки
              </h2>
              <div className="space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Управление заказом</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Статус заказа</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Статус оплаты</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {paymentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <ValidatedInput
                  label="Трек-номер"
                  value={formData.trackingNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, trackingNumber: value }))}
                  placeholder="Введите трек-номер"
                  validationRules={{
                    required: false,
                    minLength: 5,
                    maxLength: 50,
                    message: 'Трек-номер должен содержать от 5 до 50 символов'
                  }}
                />

                <ValidatedTextarea
                  label="Примечания"
                  value={formData.notes}
                  onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
                  placeholder="Добавьте примечания к заказу"
                  rows={3}
                  validationRules={{
                    required: false,
                    maxLength: 500
                  }}
                  showCharCount
                />

                <Button 
                  onClick={handleUpdate} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить изменения
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Timeline */}
            {(order.shippedAt || order.deliveredAt) && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">История</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Заказ создан</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  {order.shippedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Отправлен</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.shippedAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Доставлен</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.deliveredAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
