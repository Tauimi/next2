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
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'
    const moveToCategoryId = searchParams.get('moveTo')
    
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
        children: {
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

    console.log('Deleting category:', {
      id: existingCategory.id,
      name: existingCategory.name,
      productsCount: existingCategory._count.products,
      actualProducts: existingCategory.products.length,
      childrenCount: existingCategory._count.children,
      force,
      moveToCategoryId,
      products: existingCategory.products.map((p: { id: string; name: string }) => ({
        id: p.id,
        name: p.name
      }))
    })

    // Проверяем есть ли подкатегории
    if (existingCategory._count.children > 0) {
      if (!force) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Cannot delete category with ${existingCategory._count.children} subcategories: ${existingCategory.children.map((c: { id: string; name: string }) => c.name).join(', ')}. Use force=true to move them to parent category.`,
            hasChildren: true,
            children: existingCategory.children
          },
          { status: 400 }
        )
      }
      
      // Перемещаем подкатегории к родителю удаляемой категории
      await prisma.category.updateMany({
        where: { parentId: idOrSlug },
        data: { parentId: existingCategory.parentId }
      })
      
      console.log(`Moved ${existingCategory._count.children} subcategories to parent`)
    }

    // Проверяем есть ли товары в категории
    if (existingCategory._count.products > 0) {
      if (!force && !moveToCategoryId) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Cannot delete category with ${existingCategory._count.products} products: ${existingCategory.products.map((p: { id: string; name: string }) => p.name).join(', ')}. Use force=true to delete products or provide moveTo parameter.`,
            hasProducts: true,
            products: existingCategory.products
          },
          { status: 400 }
        )
      }

      if (moveToCategoryId) {
        // Проверяем существование целевой категории
        const targetCategory = await prisma.category.findUnique({
          where: { id: moveToCategoryId }
        })

        if (!targetCategory) {
          return NextResponse.json(
            { success: false, error: 'Target category not found' },
            { status: 404 }
          )
        }

        // Перемещаем товары в другую категорию
        await prisma.product.updateMany({
          where: { categoryId: idOrSlug },
          data: { categoryId: moveToCategoryId }
        })
        
        console.log(`Moved ${existingCategory._count.products} products to category ${targetCategory.name}`)
      } else if (force) {
        // Удаляем все товары в категории (каскадное удаление)
        await prisma.product.deleteMany({
          where: { categoryId: idOrSlug }
        })
        
        console.log(`Deleted ${existingCategory._count.products} products`)
      }
    }

    // Удаляем категорию
    await prisma.category.delete({
      where: { id: idOrSlug }
    })

    console.log('Category deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error) {
    console.error('Delete category error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Access denied')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 403 }
        )
      }
      
      // Обработка ошибок Prisma
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot delete category: it has related products. Please move or delete products first.' 
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
