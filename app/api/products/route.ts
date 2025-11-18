import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createSlug } from '@/lib/utils'
import { 
  withRetry, 
  getSafePagination, 
  buildSearchFilters, 
  optimizedProductInclude 
} from '@/lib/db-utils'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/products - Получение списка товаров
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Безопасная пагинация
    const { page, limit, skip, take } = getSafePagination(
      searchParams.get('page'),
      searchParams.get('limit'),
      50, // максимум 50 товаров за раз
      12  // по умолчанию 12
    )
    
    const categoryId = searchParams.get('categoryId')
    const brandId = searchParams.get('brandId')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const inStock = searchParams.get('inStock')
    const isFeatured = searchParams.get('isFeatured')
    const isNew = searchParams.get('isNew')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search')

    // Построение фильтров
    const where: any = {
      isActive: true, // Показываем только активные товары
      ...buildSearchFilters(search)
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (brandId) {
      where.brandId = brandId
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    
    if (inStock === 'true') {
      where.inStock = true
      where.stockQuantity = { gt: 0 }
    }
    
    if (isFeatured === 'true') {
      where.isFeatured = true
    }
    
    if (isNew === 'true') {
      where.isNew = true
    }

    // Валидация сортировки
    const allowedSortFields = ['createdAt', 'price', 'name', 'averageRating']
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc'

    // Выполнение запросов с retry логикой
    const [products, totalCount] = await withRetry(async () => {
      return Promise.all([
        prisma.product.findMany({
          where,
          include: optimizedProductInclude,
          orderBy: { [validSortBy]: validSortOrder },
          skip,
          take
        }),
        prisma.product.count({ where })
      ])
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        categoryId,
        brandId,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        inStock: inStock === 'true',
        isFeatured: isFeatured === 'true',
        isNew: isNew === 'true',
        search,
        sortBy: validSortBy,
        sortOrder: validSortOrder
      }
    })

  } catch (error) {
    console.error('Products GET Error:', error)
    return NextResponse.json(
      { 
        error: 'Ошибка загрузки товаров',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : String(error))
          : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Создание нового товара
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      categoryId,
      brandId,
      inStock = true,
      stockQuantity = 0,
      minQuantity = 1,
      isActive = true,
      isFeatured = false,
      isNew = false,
      isHot = false,
      metaTitle,
      metaDescription,
      keywords = [],
      specifications = [],
    } = body

    // Валидация обязательных полей
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, categoryId' },
        { status: 400 }
      )
    }

    // Генерация уникального SKU и slug
    const slug = createSlug(name)
    const sku = `SKU${Date.now()}`

    // Создание товара
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        sku,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        categoryId,
        brandId,
        inStock,
        stockQuantity: parseInt(stockQuantity),
        minQuantity: parseInt(minQuantity),
        isActive,
        isFeatured,
        isNew,
        isHot,
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || shortDescription || description.slice(0, 160),
        keywords,
      },
      include: {
        category: true,
        brand: true,
        images: true,
      }
    })

    // Создание характеристик товара
    if (specifications.length > 0) {
      await prisma.productSpecification.createMany({
        data: specifications.map((spec: any, index: number) => ({
          productId: product.id,
          name: spec.name,
          value: spec.value,
          unit: spec.unit || null,
          groupName: spec.groupName || null,
          sortOrder: index,
        }))
      })
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    })

  } catch (error) {
    console.error('Product creation error:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
} 