import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/admin/orders - Получение всех заказов для админки
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Построение фильтров
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error('Admin orders GET Error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки заказов' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders - Обновление статуса заказа
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { orderId, status, paymentStatus, trackingNumber, notes } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID заказа обязателен' },
        { status: 400 }
      )
    }

    // Проверяем существование заказа
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    // Подготавливаем данные для обновления
    const updateData: any = {}
    
    if (status) {
      updateData.status = status
      
      // Автоматически устанавливаем даты
      if (status === 'SHIPPED' && !existingOrder.shippedAt) {
        updateData.shippedAt = new Date()
      }
      if (status === 'DELIVERED' && !existingOrder.deliveredAt) {
        updateData.deliveredAt = new Date()
      }
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
    }
    
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber
    }
    
    if (notes !== undefined) {
      updateData.notes = notes
    }

    updateData.updatedAt = new Date()

    // Обновляем заказ
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isPrimary: true },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Заказ успешно обновлен'
    })

  } catch (error) {
    console.error('Admin orders PATCH Error:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления заказа' },
      { status: 500 }
    )
  }
} 