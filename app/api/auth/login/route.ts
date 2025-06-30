import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken } from '@/lib/auth'
import { isValidEmail } from '@/lib/utils'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('Login API called')
  
  try {
    const body = await request.json()
    const { email, password } = body
    
    console.log('Login attempt for:', email)

    // Валидация входных данных
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Поиск пользователя в базе данных
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Проверка активности аккаунта
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Проверка пароля
    const isPasswordValid = await verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Создание JWT токена
    const token = createToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    })

    // Данные пользователя для ответа (без пароля)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    }

    // Создание ответа с установкой cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token,
    })

    // Установка HTTP-only cookie с токеном
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    // Детализированное логирование для диагностики
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    )
  }
} 