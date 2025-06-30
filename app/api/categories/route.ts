import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/categories - Получение списка категорий
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const onlyActive = searchParams.get('onlyActive') !== 'false' // по умолчанию true

    const categories = await prisma.category.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: onlyActive ? { isActive: true } : {},
          orderBy: { sortOrder: 'asc' },
          include: includeProducts ? {
            products: {
              where: { isActive: true },
              take: 5,
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                originalPrice: true,
                discount: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: {
                    url: true,
                    alt: true,
                  }
                }
              }
            }
          } : undefined
        },
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      },
    })

    return NextResponse.json({
      success: true,
      data: categories
    })

  } catch (error) {
    console.error('Categories API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Создание новой категории
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const {
      name,
      description,
      parentId,
      sortOrder = 0,
      isActive = true,
      image,
    } = body

    // Валидация обязательных полей
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Генерация slug
    const slug = createSlug(name)

    // Проверка уникальности slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    // Создание категории
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId,
        sortOrder: parseInt(sortOrder),
        isActive,
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
      message: 'Category created successfully'
    })

  } catch (error) {
    console.error('Category creation error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 