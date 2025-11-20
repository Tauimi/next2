import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

// Проверяем является ли параметр ID (CUID) или slug
function isId(param: string): boolean {
  // CUID имеет формат: c + 24 символа
  return param.length === 25 && param.startsWith('c')
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const isIdParam = isId(slug)

    const product = await prisma.product.findFirst({
      where: isIdParam 
        ? { id: slug }
        : { slug: slug, isActive: true },
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
          orderBy: {
            sortOrder: 'asc'
          }
        },
        specifications: {
          orderBy: {
            sortOrder: 'asc'
          }
        },
        reviews: {
          where: {
            isApproved: true
          },
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Товар не найден'
        },
        { status: 404 }
      )
    }

    // Вычисляем средний рейтинг
    const reviews = await prisma.review.findMany({
      where: {
        productId: product.id,
        isApproved: true
      },
      select: {
        rating: true
      }
    })

    interface ReviewWithRating {
      rating: number
    }
    
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum: number, review: ReviewWithRating) => sum + review.rating, 0) / reviews.length
      : 0

    const totalReviews = reviews.length

    const productWithRating = {
      ...product,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews
    }

    return NextResponse.json({
      success: true,
      data: productWithRating
    })

  } catch (error) {
    console.error('Ошибка получения товара:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
} 

// PUT /api/products/[slug] - Обновление товара (только для админов, использует ID)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin(request)

    const { slug: idOrSlug } = params
    
    // Для редактирования используем только ID
    if (!isId(idOrSlug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      categoryId,
      brandId,
      stockQuantity,
      sku,
      isActive,
      isFeatured,
      isNew,
      isHot,
    } = body

    // Проверяем существование товара
    const existingProduct = await prisma.product.findUnique({
      where: { id: idOrSlug }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Генерируем новый slug если изменилось название
    let newSlug = existingProduct.slug
    if (name && name !== existingProduct.name) {
      newSlug = createSlug(name)
      
      // Проверяем уникальность нового slug
      const slugExists = await prisma.product.findFirst({
        where: { 
          slug: newSlug,
          id: { not: idOrSlug }
        }
      })

      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`
      }
    }

    // Обновляем товар
    const product = await prisma.product.update({
      where: { id: idOrSlug },
      data: {
        name,
        slug: newSlug,
        description,
        shortDescription,
        price: price ? parseFloat(price) : undefined,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discount: originalPrice && price 
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : null,
        categoryId,
        brandId: brandId || null,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : undefined,
        inStock: stockQuantity ? parseInt(stockQuantity) > 0 : undefined,
        sku,
        isActive: isActive !== undefined ? isActive : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
        isNew: isNew !== undefined ? isNew : undefined,
        isHot: isHot !== undefined ? isHot : undefined,
      },
      include: {
        category: true,
        brand: true,
        images: true
      }
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Update product error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[slug] - Удаление товара (только для админов, использует ID)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin(request)

    const { slug: idOrSlug } = params
    
    // Для удаления используем только ID
    if (!isId(idOrSlug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Проверяем существование товара
    const existingProduct = await prisma.product.findUnique({
      where: { id: idOrSlug }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Удаляем связанные данные и товар
    console.log('Deleting product with all related data:', idOrSlug)
    
    await prisma.$transaction([
      // Удаляем из корзин
      prisma.cartItem.deleteMany({
        where: { productId: idOrSlug }
      }),
      // Удаляем из избранного
      prisma.wishlistItem.deleteMany({
        where: { productId: idOrSlug }
      }),
      // Удаляем из сравнения
      prisma.compareItem.deleteMany({
        where: { productId: idOrSlug }
      }),
      // Удаляем отзывы (изображения отзывов удалятся каскадно)
      prisma.review.deleteMany({
        where: { productId: idOrSlug }
      }),
      // Удаляем изображения товара
      prisma.productImage.deleteMany({
        where: { productId: idOrSlug }
      }),
      // Удаляем видео товара
      prisma.productVideo.deleteMany({
        where: { productId: idOrSlug }
      }),
      // Удаляем характеристики
      prisma.productSpecification.deleteMany({
        where: { productId: idOrSlug }
      }),
      // Удаляем связи с другими товарами
      prisma.productRelation.deleteMany({
        where: {
          OR: [
            { fromProductId: idOrSlug },
            { toProductId: idOrSlug }
          ]
        }
      }),
      // Удаляем товар
      prisma.product.delete({
        where: { id: idOrSlug }
      })
    ])
    
    console.log('Product deleted successfully with all related data')

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete product error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Access denied')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 403 }
        )
      }
      
      // Обработка ошибок foreign key
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot delete product: it has related records. Please try again or contact support.',
            details: error.message
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
