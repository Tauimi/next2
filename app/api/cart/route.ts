import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/cart - Получение корзины пользователя
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Подсчет общей суммы
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        totalAmount,
        totalItems,
      }
    })

  } catch (error) {
    console.error('Cart GET Error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки корзины' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Добавление товара в корзину
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
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Количество должно быть не менее 1' },
        { status: 400 }
      )
    }

    // Проверяем существование товара
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        isActive: true,
        inStock: true,
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден или недоступен' },
        { status: 404 }
      )
    }

    // Проверяем достаточность товара на складе
    if (product.stockQuantity && product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Недостаточно товара на складе' },
        { status: 400 }
      )
    }

    // Проверяем существующий товар в корзине
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      }
    })

    let cartItem

    if (existingCartItem) {
      // Обновляем количество
      const newQuantity = existingCartItem.quantity + quantity
      
      // Проверяем лимит склада
      if (product.stockQuantity && product.stockQuantity < newQuantity) {
        return NextResponse.json(
          { error: 'Недостаточно товара на складе' },
          { status: 400 }
        )
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { 
          quantity: newQuantity,
          updatedAt: new Date(),
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              }
            }
          }
        }
      })
    } else {
      // Создаем новый элемент корзины
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
          quantity: quantity,
          price: product.price,
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              }
            }
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Товар добавлен в корзину'
    })

  } catch (error) {
    console.error('Cart POST Error:', error)
    return NextResponse.json(
      { error: 'Ошибка добавления товара в корзину' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Обновление количества товара в корзине
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { cartItemId, quantity } = body

    if (!cartItemId || quantity < 1) {
      return NextResponse.json(
        { error: 'ID товара и корректное количество обязательны' },
        { status: 400 }
      )
    }

    // Проверяем принадлежность товара пользователю
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: user.id,
      },
      include: {
        product: true
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Товар в корзине не найден' },
        { status: 404 }
      )
    }

    // Проверяем достаточность товара на складе
    if (cartItem.product.stockQuantity && cartItem.product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Недостаточно товара на складе' },
        { status: 400 }
      )
    }

    // Обновляем количество
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { 
        quantity,
        updatedAt: new Date(),
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCartItem,
      message: 'Корзина обновлена'
    })

  } catch (error) {
    console.error('Cart PUT Error:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления корзины' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Удаление товара из корзины
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('itemId')
    const clearAll = searchParams.get('clearAll') === 'true'

    if (clearAll) {
      // Очистка всей корзины
      await prisma.cartItem.deleteMany({
        where: { userId: user.id }
      })

      return NextResponse.json({
        success: true,
        message: 'Корзина очищена'
      })
    }

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'ID товара в корзине обязателен' },
        { status: 400 }
      )
    }

    // Проверяем принадлежность товара пользователю
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: user.id,
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Товар в корзине не найден' },
        { status: 404 }
      )
    }

    // Удаляем товар из корзины
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    return NextResponse.json({
      success: true,
      message: 'Товар удален из корзины'
    })

  } catch (error) {
    console.error('Cart DELETE Error:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления товара из корзины' },
      { status: 500 }
    )
  }
} 