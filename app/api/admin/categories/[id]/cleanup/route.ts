import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/categories/[id]/cleanup - Очистка "призрачных" товаров
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)

    const { id } = await params

    // Получаем категорию с товарами
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
            createdAt: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    console.log('Category cleanup:', {
      categoryId: id,
      categoryName: category.name,
      productsFound: category.products.length,
      products: category.products
    })

    // Возвращаем информацию о товарах
    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug
        },
        products: category.products,
        productsCount: category.products.length
      }
    })

  } catch (error) {
    console.error('Category cleanup error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to cleanup category' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id]/cleanup - Удалить все товары в категории
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)

    const { id } = await params

    // Удаляем все товары в категории
    const result = await prisma.product.deleteMany({
      where: { categoryId: id }
    })

    console.log('Deleted products:', result.count)

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} products`,
      deletedCount: result.count
    })

  } catch (error) {
    console.error('Delete products error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete products' },
      { status: 500 }
    )
  }
}
