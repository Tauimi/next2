import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/compare - Получение товаров для сравнения
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const compareItems = await prisma.compareItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: {
              select: { name: true, slug: true }
            },
            brand: {
              select: { name: true, slug: true }
            },
            specifications: {
              orderBy: [
                { groupName: 'asc' },
                { sortOrder: 'asc' },
                { name: 'asc' }
              ]
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Группируем характеристики для удобства сравнения
    interface GroupedSpec {
      name: string
      unit?: string | null
      values: Record<string, string>
    }
    
    interface CompareItemWithSpecs {
      productId: string
      product: {
        specifications: Array<{
          name: string
          value: string
          unit?: string | null
          groupName?: string | null
        }>
      }
    }
    
    const groupedSpecs: Record<string, GroupedSpec[]> = {}
    
    compareItems.forEach((item: CompareItemWithSpecs) => {
      item.product.specifications.forEach((spec) => {
        const groupName = spec.groupName || 'Основные характеристики'
        if (!groupedSpecs[groupName]) {
          groupedSpecs[groupName] = []
        }
        
        const existingSpec = groupedSpecs[groupName].find((s) => s.name === spec.name)
        if (!existingSpec) {
          groupedSpecs[groupName].push({
            name: spec.name,
            unit: spec.unit,
            values: {
              [item.productId]: spec.value
            }
          })
        } else {
          existingSpec.values[item.productId] = spec.value
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        items: compareItems,
        groupedSpecs,
        total: compareItems.length
      }
    })

  } catch (error) {
    console.error('Compare GET Error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки сравнения' },
      { status: 500 }
    )
  }
}

// POST /api/compare - Добавление товара в сравнение
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    // Проверяем существование товара
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        isActive: true
      },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Проверяем, не добавлен ли товар уже в сравнение
    const existingItem = await prisma.compareItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Товар уже в сравнении' },
        { status: 400 }
      )
    }

    // Проверяем лимит товаров в сравнении (максимум 4 товара)
    const compareCount = await prisma.compareItem.count({
      where: { userId: user.id }
    })

    if (compareCount >= 4) {
      return NextResponse.json(
        { error: 'Максимум 4 товара для сравнения. Удалите один товар для добавления нового.' },
        { status: 400 }
      )
    }

    // Проверяем, что товары одной категории (для корректного сравнения)
    if (compareCount > 0) {
      const existingCompareItems = await prisma.compareItem.findMany({
        where: { userId: user.id },
        include: {
          product: {
            select: { categoryId: true }
          }
        }
      })

      const existingCategoryId = existingCompareItems[0].product.categoryId
      if (product.categoryId !== existingCategoryId) {
        return NextResponse.json(
          { error: 'Можно сравнивать только товары одной категории' },
          { status: 400 }
        )
      }
    }

    // Добавляем товар в сравнение
    const compareItem = await prisma.compareItem.create({
      data: {
        userId: user.id,
        productId: productId
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: {
              select: { name: true, slug: true }
            },
            brand: {
              select: { name: true, slug: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: compareItem,
      message: 'Товар добавлен в сравнение'
    })

  } catch (error) {
    console.error('Compare POST Error:', error)
    return NextResponse.json(
      { error: 'Ошибка добавления в сравнение' },
      { status: 500 }
    )
  }
}

// DELETE /api/compare - Удаление товара из сравнения
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const clearAll = searchParams.get('clearAll') === 'true'
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    if (clearAll) {
      // Очистка всего сравнения
      await prisma.compareItem.deleteMany({
        where: { userId: user.id }
      })

      return NextResponse.json({
        success: true,
        message: 'Сравнение очищено'
      })
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    // Проверяем существование товара в сравнении
    const compareItem = await prisma.compareItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (!compareItem) {
      return NextResponse.json(
        { error: 'Товар не найден в сравнении' },
        { status: 404 }
      )
    }

    // Удаляем товар из сравнения
    await prisma.compareItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Товар удален из сравнения'
    })

  } catch (error) {
    console.error('Compare DELETE Error:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления из сравнения' },
      { status: 500 }
    )
  }
} 