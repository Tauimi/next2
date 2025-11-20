import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { ApiResponse, OrderCreateInput } from '@/types/api'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/orders - Получение заказов пользователя
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    // Построение фильтров
    const where: Prisma.OrderWhereInput = {
      userId: user.id
    }

    if (status) {
      where.status = status as Prisma.EnumOrderStatusFilter
    }

    // Подсчет общего количества
    const total = await prisma.order.count({ where })

    // Получение заказов с пагинацией
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: {
                    url: true,
                    alt: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })

  } catch (error) {
    console.error('Orders GET Error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки заказов' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Создание нового заказа
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      notes,
      paymentMethod = 'CASH',
      shippingMethod = 'COURIER'
    } = body

    // Валидация обязательных полей
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Валидация способа оплаты
    const validPaymentMethods = ['CASH', 'CARD_COURIER', 'CARD_ONLINE', 'BANK_TRANSFER', 'SBP']
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Неверный способ оплаты' },
        { status: 400 }
      )
    }

    // Валидация способа доставки
    const validShippingMethods = ['COURIER', 'PICKUP', 'POST', 'CDEK', 'BOXBERRY']
    if (!validShippingMethods.includes(shippingMethod)) {
      return NextResponse.json(
        { error: 'Неверный способ доставки' },
        { status: 400 }
      )
    }

    // Получаем товары из корзины
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            inStock: true,
            stockQuantity: true,
          }
        }
      }
    })

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Корзина пуста' },
        { status: 400 }
      )
    }

    // Проверяем наличие товаров на складе
    for (const item of cartItems) {
      if (!item.product.inStock) {
        return NextResponse.json(
          { error: `Товар "${item.product.name}" недоступен` },
          { status: 400 }
        )
      }
      
      if (item.product.stockQuantity && item.product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Недостаточно товара "${item.product.name}" на складе` },
          { status: 400 }
        )
      }
    }

    // Подсчет суммы заказа
    interface CartItemWithPrice {
      product: { price: number }
      quantity: number
    }
    
    const subtotal = cartItems.reduce((sum: number, item: CartItemWithPrice) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    // Расчет стоимости доставки в зависимости от способа
    let shippingCost = 0
    if (shippingMethod === 'COURIER') {
      shippingCost = subtotal >= 50000 ? 0 : 1000
    } else if (shippingMethod === 'PICKUP') {
      shippingCost = 0 // Самовывоз бесплатно
    } else if (shippingMethod === 'POST') {
      shippingCost = 500
    } else if (shippingMethod === 'CDEK' || shippingMethod === 'BOXBERRY') {
      shippingCost = 700
    }

    const tax = 0 // НДС включен в цену
    const discount = 0 // Без скидок пока
    const totalAmount = subtotal + shippingCost + tax - discount

    // Генерация номера заказа
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    // Проверка на дубли заказов (за последние 5 минут)
    const recentOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        customerEmail,
        totalAmount,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // 5 минут назад
        }
      }
    })

    if (recentOrder) {
      return NextResponse.json(
        { 
          error: 'Похожий заказ уже был создан недавно',
          orderId: recentOrder.id 
        },
        { status: 400 }
      )
    }

    // Создание заказа в транзакции
    const order = await prisma.$transaction(async (tx: any) => {
      // Создаем заказ
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          billingAddress,
          subtotal,
          shippingCost,
          tax,
          discount,
          totalAmount,
          notes,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod,
          shippingMethod
        }
      })

      // Создаем элементы заказа
      interface CartItemForOrder {
        productId: string
        quantity: number
        product: {
          price: number
          stockQuantity: number
        }
      }
      
      const orderItems = await Promise.all(
        cartItems.map((item: CartItemForOrder) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              totalPrice: item.product.price * item.quantity
            }
          })
        )
      )

      // Обновляем количество товаров на складе
      await Promise.all(
        cartItems.map((item: CartItemForOrder) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: item.product.stockQuantity 
                ? Math.max(0, item.product.stockQuantity - item.quantity)
                : 0
            }
          })
        )
      )

      // Очищаем корзину пользователя
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      })

      return { ...newOrder, items: orderItems }
    })

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Заказ успешно создан'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Ошибка создания заказа' },
      { status: 500 }
    )
  }
} 