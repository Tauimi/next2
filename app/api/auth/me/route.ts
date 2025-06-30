import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Токен не найден' },
        { status: 401 }
      )
    }

    // Проверяем токен
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Неверный токен' },
        { status: 401 }
      )
    }

    // Возвращаем данные пользователя
    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        username: payload.username,
        isAdmin: payload.isAdmin
      }
    })

  } catch (error) {
    console.error('Me endpoint error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
} 