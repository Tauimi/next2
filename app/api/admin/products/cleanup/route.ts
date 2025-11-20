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
      // Удалить один товар
      await prisma.product.delete({
        where: { id: productId }
      })

      return NextResponse.json({
        success: true,
        message: 'Product deleted',
        deletedId: productId
      })
    } else if (categoryId) {
      // Удалить все товары в категории
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
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
