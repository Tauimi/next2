import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// Проверяем является ли параметр ID (CUID) или slug
function isId(param: string): boolean {
  return param.length === 25 && param.startsWith('c')
}

// GET /api/categories/[slug] - Получение категории по ID или slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const isIdParam = isId(slug)

    const category = await prisma.category.findFirst({
      where: isIdParam ? { id: slug } : { slug },
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

// PUT /api/categories/[slug] - Обновление категории (только для админов, использует ID)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin(request)

    const { slug: idOrSlug } = params
    
    // Для редактирования используем только ID
    if (!isId(idOrSlug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      )
    }

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
      where: { id: idOrSlug }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Генерируем новый slug если изменилось название
    let newSlug = existingCategory.slug
    if (name && name !== existingCategory.name) {
      newSlug = createSlug(name)
      
      // Проверяем уникальность нового slug
      const slugExists = await prisma.category.findFirst({
        where: { 
          slug: newSlug,
          id: { not: idOrSlug }
        }
      })

      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`
      }
    }

    // Обновляем категорию
    const category = await prisma.category.update({
      where: { id: idOrSlug },
      data: {
        name,
        slug: newSlug,
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

// DELETE /api/categories/[slug] - Удаление категории (только для админов, использует ID)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin(request)

    const { slug: idOrSlug } = params
    
    // Для удаления используем только ID
    if (!isId(idOrSlug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id: idOrSlug },
      include: {
        products: {
          select: {
            id: true,
            name: true
          }
        },
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
    console.log('Category products:', existingCategory.products)
    console.log('Category _count.products:', existingCategory._count.products)
    
    if (existingCategory.products.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${existingCategory.products.length} products: ${existingCategory.products.map(p => p.name).join(', ')}` 
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
      where: { id: idOrSlug }
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
