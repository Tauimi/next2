'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Package, Eye, Trash2, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
  refunded: 'Возврат',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const url = statusFilter === 'all' 
        ? '/api/admin/orders'
        : `/api/admin/orders?status=${statusFilter}`
      
      const response = await fetch(url)
      const data = await response.json()
      setOrders(data.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const deleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Вы уверены, что хотите удалить заказ ${orderNumber}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete order')
      }

      setOrders(prev => prev.filter(order => order.id !== orderId))
      alert('Заказ успешно удалён')
    } catch (error) {
      console.error('Error deleting order:', error)
      alert(error instanceof Error ? error.message : 'Ошибка удаления заказа')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Заказы</h1>
              <p className="text-muted-foreground">
                Всего заказов: {orders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидает</option>
              <option value="confirmed">Подтверждён</option>
              <option value="processing">В обработке</option>
              <option value="shipped">Отправлен</option>
              <option value="delivered">Доставлен</option>
              <option value="cancelled">Отменён</option>
            </select>

            <Button onClick={fetchOrders} variant="outline">
              Обновить
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Номер заказа</th>
                  <th className="text-left p-4 font-medium">Клиент</th>
                  <th className="text-left p-4 font-medium">Товары</th>
                  <th className="text-left p-4 font-medium">Сумма</th>
                  <th className="text-left p-4 font-medium">Статус</th>
                  <th className="text-left p-4 font-medium">Дата</th>
                  <th className="text-center p-4 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                      Заказы не найдены
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-muted/20">
                      <td className="p-4">
                        <div className="font-medium">#{order.orderNumber}</div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.items.length} товар(ов)
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{order.totalAmount.toLocaleString()} ₽</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button size="sm" variant="outline" title="Просмотр">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Удалить"
                            onClick={() => deleteOrder(order.id, order.orderNumber)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        {orders.length > 0 && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Ожидают</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'processing').length}
                </div>
                <div className="text-sm text-muted-foreground">В обработке</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div className="text-sm text-muted-foreground">Доставлено</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()} ₽
                </div>
                <div className="text-sm text-muted-foreground">Общая сумма</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
