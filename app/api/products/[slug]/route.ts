import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params

    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        isActive: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        },
        specifications: {
          orderBy: {
            sortOrder: 'asc'
          }
        },
        reviews: {
          where: {
            isApproved: true
          },
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Товар не найден'
        },
        { status: 404 }
      )
    }

    // Вычисляем средний рейтинг
    const reviews = await prisma.review.findMany({
      where: {
        productId: product.id,
        isApproved: true
      },
      select: {
        rating: true
      }
    })

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    const totalReviews = reviews.length

    const productWithRating = {
      ...product,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews
    }

    return NextResponse.json({
      success: true,
      data: productWithRating
    })

  } catch (error) {
    console.error('Ошибка получения товара:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    )
  }
} 