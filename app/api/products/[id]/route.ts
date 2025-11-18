import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// GET /api/products/[id] - Получение товара по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        specifications: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Обновление товара
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const {
      name,
      description,
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
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Генерируем новый slug если изменилось название
    let slug = existingProduct.slug
    if (name && name !== existingProduct.name) {
      slug = createSlug(name)
      
      // Проверяем уникальность нового slug
      const slugExists = await prisma.product.findFirst({
        where: { 
          slug,
          id: { not: params.id }
        }
      })

      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Обновляем товар
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
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

// DELETE /api/products/[id] - Удаление товара
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    // Проверяем существование товара
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Удаляем связанные данные и товар
    await prisma.$transaction([
      // Удаляем изображения
      prisma.productImage.deleteMany({
        where: { productId: params.id }
      }),
      // Удаляем характеристики
      prisma.productSpecification.deleteMany({
        where: { productId: params.id }
      }),
      // Удаляем товар
      prisma.product.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete product error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
