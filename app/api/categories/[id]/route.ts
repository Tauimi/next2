import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// GET /api/categories/[id] - Получение категории по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true
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

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Обновление категории
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
      parentId,
      sortOrder,
      isActive,
      image,
    } = body

    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Генерируем новый slug если изменилось название
    let slug = existingCategory.slug
    if (name && name !== existingCategory.name) {
      slug = createSlug(name)
      
      // Проверяем уникальность нового slug
      const slugExists = await prisma.category.findFirst({
        where: { 
          slug,
          id: { not: params.id }
        }
      })

      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Обновляем категорию
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        image,
      },
      include: {
        children: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    })

  } catch (error) {
    console.error('Update category error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Удаление категории
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Проверяем есть ли товары в категории
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${existingCategory._count.products} products. Please move or delete products first.` 
        },
        { status: 400 }
      )
    }

    // Проверяем есть ли подкатегории
    if (existingCategory._count.children > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${existingCategory._count.children} subcategories. Please delete subcategories first.` 
        },
        { status: 400 }
      )
    }

    // Удаляем категорию
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error) {
    console.error('Delete category error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
