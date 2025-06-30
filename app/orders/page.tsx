'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, Truck, CheckCircle, XCircle, Clock, 
  Eye, ArrowLeft, Calendar, CreditCard, MapPin 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { formatDate, formatPrice } from '@/lib/utils'

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  id: string
  productName: string
  productSlug: string
  quantity: number
  price: number
  totalPrice: number
  image?: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  status: OrderStatus
  createdAt: Date | string
  shippedAt?: Date | string
  deliveredAt?: Date | string
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    zipCode: string
  }
}

// Заказы будут загружаться из API

const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return { 
        label: 'Ожидает подтверждения', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock 
      }
    case 'confirmed':
      return { 
        label: 'Подтвержден', 
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircle 
      }
    case 'processing':
      return { 
        label: 'Обрабатывается', 
        color: 'bg-orange-100 text-orange-800',
        icon: Package 
      }
    case 'shipped':
      return { 
        label: 'Отправлен', 
        color: 'bg-purple-100 text-purple-800',
        icon: Truck 
      }
    case 'delivered':
      return { 
        label: 'Доставлен', 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle 
      }
    case 'cancelled':
      return { 
        label: 'Отменен', 
        color: 'bg-red-100 text-red-800',
        icon: XCircle 
      }
  }
}

export default function OrdersPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/orders')
      return
    }

    // Имитируем загрузку заказов
    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setOrders(data.data || [])
          }
        }
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Перенаправление...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад в профиль
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Мои заказы</h1>
                <p className="text-xl text-muted-foreground">
                  История покупок и статус доставки
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">У вас пока нет заказов</h3>
                <p className="text-muted-foreground mb-6">
                  Начните покупки в нашем каталоге товаров
                </p>
                <Button asChild>
                  <Link href="/catalog">
                    Перейти в каталог
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status)
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm border">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Заказ {order.orderNumber}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(new Date(order.createdAt))}
                              </span>
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                {formatPrice(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Подробнее
                          </Button>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted/50 rounded-lg overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.productName}
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
                                href={`/product/${item.productSlug}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {item.productName}
                              </Link>
                              <div className="text-sm text-muted-foreground">
                                Количество: {item.quantity} × {formatPrice(item.price)}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatPrice(item.totalPrice)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>
                            Доставка: {order.shippingAddress.city}, {order.shippingAddress.street}
                          </span>
                        </div>
                        
                        {order.shippedAt && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Truck className="w-4 h-4" />
                            <span>
                              Отправлен: {formatDate(new Date(order.shippedAt))}
                            </span>
                          </div>
                        )}
                        
                        {order.deliveredAt && (
                          <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>
                              Доставлен: {formatDate(new Date(order.deliveredAt))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
} 