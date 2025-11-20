import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/products/cleanup - Показать все товары (включая неактивные)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const where = categoryId ? { categoryId } : {}

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/cleanup?productId=xxx - Удалить конкретный товар
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const categoryId = searchParams.get('categoryId')

    if (productId) {
      // Сначала удаляем все связанные записи
      console.log('Deleting product and related records:', productId)
      
      // Удаляем из корзин
      const cartDeleted = await prisma.cartItem.deleteMany({
        where: { productId }
      })
      console.log('Deleted from carts:', cartDeleted.count)

      // Удаляем из избранного
      const wishlistDeleted = await prisma.wishlistItem.deleteMany({
        where: { productId }
      })
      console.log('Deleted from wishlists:', wishlistDeleted.count)

      // Удаляем из сравнения
      const compareDeleted = await prisma.compareItem.deleteMany({
        where: { productId }
      })
      console.log('Deleted from compare:', compareDeleted.count)

      // Удаляем отзывы (каскадно удалятся изображения отзывов)
      const reviewsDeleted = await prisma.review.deleteMany({
        where: { productId }
      })
      console.log('Deleted reviews:', reviewsDeleted.count)

      // Теперь можно удалить товар (изображения, видео, характеристики удалятся каскадно)
      await prisma.product.delete({
        where: { id: productId }
      })

      return NextResponse.json({
        success: true,
        message: 'Product deleted with all related data',
        deletedId: productId,
        relatedDeleted: {
          cartItems: cartDeleted.count,
          wishlistItems: wishlistDeleted.count,
          compareItems: compareDeleted.count,
          reviews: reviewsDeleted.count
        }
      })
    } else if (categoryId) {
      // Получаем все товары в категории
      const products = await prisma.product.findMany({
        where: { categoryId },
        select: { id: true }
      })

      const productIds = products.map((p: { id: string }) => p.id)

      // Удаляем все связанные записи
      await prisma.cartItem.deleteMany({
        where: { productId: { in: productIds } }
      })

      await prisma.wishlistItem.deleteMany({
        where: { productId: { in: productIds } }
      })

      await prisma.compareItem.deleteMany({
        where: { productId: { in: productIds } }
      })

      await prisma.review.deleteMany({
        where: { productId: { in: productIds } }
      })

      // Удаляем все товары
      const result = await prisma.product.deleteMany({
        where: { categoryId }
      })

      return NextResponse.json({
        success: true,
        message: `Deleted ${result.count} products`,
        deletedCount: result.count
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'productId or categoryId required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Delete product error:', error)
    
    // Более подробная информация об ошибке
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete product',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
