import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/admin/stats - Получение статистики для админ-панели
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    // Получаем статистику параллельно
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts,
      monthlyStats
    ] = await Promise.all([
      // Общее количество товаров
      prisma.product.count({
        where: { isActive: true }
      }),
      
      // Общее количество категорий
      prisma.category.count({
        where: { isActive: true }
      }),
      
      // Общее количество заказов
      prisma.order.count(),
      
      // Общее количество пользователей
      prisma.user.count({
        where: { isActive: true }
      }),
      
      // Общая выручка
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] }
        }
      }),
      
      // Последние 5 заказов
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { username: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        }
      }),
      
      // Топ товары по продажам
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      
      // Статистика по месяцам (последние 6 месяцев)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as orders,
          SUM("totalAmount")::float as revenue
        FROM "orders"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 6
      `
    ])

    // Получаем данные о топ товарах
    const topProductsData = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true }
        })
        return {
          name: product?.name || 'Неизвестный товар',
          quantity: item._sum.quantity || 0,
          orders: item._count.productId,
          revenue: (product?.price || 0) * (item._sum.quantity || 0)
        }
      })
    )

    const stats = {
      overview: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue._sum.totalAmount || 0
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.user?.email || order.customerEmail,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: order.items.length
      })),
      topProducts: topProductsData,
      monthlyStats: (monthlyStats as any[]).map(stat => ({
        month: stat.month,
        orders: stat.orders,
        revenue: stat.revenue
      }))
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Admin stats API Error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    )
  }
} 