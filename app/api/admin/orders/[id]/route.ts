import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/orders/[id] - Получение заказа по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Get order error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders/[id] - Обновление статуса заказа
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { status, paymentStatus, trackingNumber, notes } = body

    // Конвертируем статусы в верхний регистр для Prisma
    const statusUpper = status ? String(status).toUpperCase() : undefined
    const paymentStatusUpper = paymentStatus ? String(paymentStatus).toUpperCase() : undefined

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: statusUpper,
        paymentStatus: paymentStatusUpper,
        trackingNumber,
        notes,
        shippedAt: statusUpper === 'SHIPPED' && !body.shippedAt ? new Date() : undefined,
        deliveredAt: statusUpper === 'DELIVERED' && !body.deliveredAt ? new Date() : undefined,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    })

  } catch (error) {
    console.error('Update order error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/orders/[id] - Удаление заказа
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    // Удаляем товары заказа и сам заказ
    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { orderId: params.id }
      }),
      prisma.order.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })

  } catch (error) {
    console.error('Delete order error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}
