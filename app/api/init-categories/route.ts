import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/init-categories - Создание базовых категорий
export async function POST() {
  try {
    const categories = [
      {
        name: 'Смартфоны',
        slug: 'smartphones',
        description: 'Современные смартфоны от ведущих производителей',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Ноутбуки',
        slug: 'laptops',
        description: 'Ноутбуки для работы, учебы и развлечений',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Телевизоры',
        slug: 'tvs',
        description: 'Телевизоры с высоким качеством изображения',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Планшеты',
        slug: 'tablets',
        description: 'Планшеты для работы и развлечений',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Аксессуары',
        slug: 'accessories',
        description: 'Аксессуары для электроники',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Игры',
        slug: 'gaming',
        description: 'Игровые консоли и аксессуары',
        sortOrder: 6,
        isActive: true,
      },
    ]

    const created = []
    
    for (const category of categories) {
      // Проверяем существует ли категория
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      })

      if (!existing) {
        const newCategory = await prisma.category.create({
          data: category
        })
        created.push(newCategory)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} categories`,
      data: created
    })

  } catch (error) {
    console.error('Init categories error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
