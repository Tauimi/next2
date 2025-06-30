import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Запрос должен содержать минимум 2 символа'
      }, { status: 400 })
    }

    const searchTerm = query.trim().toLowerCase()

    const products = await prisma.product.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
              { sku: { contains: searchTerm, mode: 'insensitive' } },
              { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
              { brand: { name: { contains: searchTerm, mode: 'insensitive' } } }
            ]
          }
        ]
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 }
      },
      take: 50,
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }]
    })

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
      query: searchTerm
    })

  } catch (error) {
    console.error('Ошибка поиска:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
} 