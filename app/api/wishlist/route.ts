import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/wishlist - Получение избранных товаров пользователя
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: {
              select: { name: true, slug: true }
            },
            brand: {
              select: { name: true, slug: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: wishlistItems,
      total: wishlistItems.length
    })

  } catch (error) {
    console.error('Wishlist GET Error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки избранного' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Добавление товара в избранное
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
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    // Проверяем существование товара
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        isActive: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Проверяем, не добавлен ли товар уже в избранное
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Товар уже в избранном' },
        { status: 400 }
      )
    }

    // Добавляем товар в избранное
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId: productId
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
      data: wishlistItem,
      message: 'Товар добавлен в избранное'
    })

  } catch (error) {
    console.error('Wishlist POST Error:', error)
    return NextResponse.json(
      { error: 'Ошибка добавления в избранное' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Удаление товара из избранного
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const clearAll = searchParams.get('clearAll') === 'true'
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    if (clearAll) {
      // Очистка всего избранного
      await prisma.wishlistItem.deleteMany({
        where: { userId: user.id }
      })

      return NextResponse.json({
        success: true,
        message: 'Избранное очищено'
      })
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    // Проверяем существование товара в избранном
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Товар не найден в избранном' },
        { status: 404 }
      )
    }

    // Удаляем товар из избранного
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Товар удален из избранного'
    })

  } catch (error) {
    console.error('Wishlist DELETE Error:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления из избранного' },
      { status: 500 }
    )
  }
} 