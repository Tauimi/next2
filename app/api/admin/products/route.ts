import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/admin/products - Получение всех товаров для админки
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
    const categoryId = searchParams.get('categoryId')
    const brandId = searchParams.get('brandId')
    const isActive = searchParams.get('isActive')
    const inStock = searchParams.get('inStock')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Построение фильтров
    const where: any = {}
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (brandId) {
      where.brandId = brandId
    }
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }
    
    if (inStock !== null && inStock !== undefined) {
      where.inStock = inStock === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            where: { isPrimary: true },
            take: 1
          },
          _count: {
            select: {
              reviews: true,
              cartItems: true,
              orderItems: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        products,
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
    console.error('Admin products GET Error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки товаров' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/products - Обновление товара
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
    const { 
      productId, 
      name, 
      description, 
      price, 
      originalPrice, 
      discount,
      inStock, 
      stockQuantity, 
      isActive, 
      isFeatured, 
      isNew, 
      isHot,
      categoryId,
      brandId
    } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    // Проверяем существование товара
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Подготавливаем данные для обновления
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null
    if (discount !== undefined) updateData.discount = discount ? parseFloat(discount) : 0
    if (inStock !== undefined) updateData.inStock = inStock
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity)
    if (isActive !== undefined) updateData.isActive = isActive
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (isNew !== undefined) updateData.isNew = isNew
    if (isHot !== undefined) updateData.isHot = isHot
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (brandId !== undefined) updateData.brandId = brandId

    updateData.updatedAt = new Date()

    // Обновляем товар
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true,
        _count: {
          select: {
            reviews: true,
            cartItems: true,
            orderItems: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Товар успешно обновлен'
    })

  } catch (error) {
    console.error('Admin products PATCH Error:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления товара' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products - Удаление товара
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

        // Проверяем существование товара
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Проверяем, используется ли товар в заказах
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId }
    })
    
    if (orderItemsCount > 0) {
      return NextResponse.json(
        { error: 'Невозможно удалить товар, так как он используется в заказах. Деактивируйте товар вместо удаления.' },
        { status: 400 }
      )
    }

    // Удаляем связанные данные
    await prisma.$transaction([
      // Удаляем из корзин
      prisma.cartItem.deleteMany({
        where: { productId }
      }),
      // Удаляем изображения
      prisma.productImage.deleteMany({
        where: { productId }
      }),
      // Удаляем видео
      prisma.productVideo.deleteMany({
        where: { productId }
      }),
      // Удаляем характеристики
      prisma.productSpecification.deleteMany({
        where: { productId }
      }),
      // Удаляем связи с товарами
      prisma.productRelation.deleteMany({
        where: {
          OR: [
            { fromProductId: productId },
            { toProductId: productId }
          ]
        }
      }),
      // Удаляем отзывы
      prisma.review.deleteMany({
        where: { productId }
      }),
      // Удаляем сам товар
      prisma.product.delete({
        where: { id: productId }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Товар успешно удален'
    })

  } catch (error) {
    console.error('Admin products DELETE Error:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления товара' },
      { status: 500 }
    )
  }
} 