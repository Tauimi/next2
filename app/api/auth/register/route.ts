import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken } from '@/lib/auth'
import { isValidEmail } from '@/lib/utils'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('Registration API called')
  
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      username, 
      firstName, 
      lastName, 
      phone 
    } = body

    console.log('Registration attempt for:', email)

    // Валидация обязательных полей
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, пароль и логин обязательны' },
        { status: 400 }
      )
    }

    // Валидация email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      )
    }

    // Валидация пароля
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 8 символов' },
        { status: 400 }
      )
    }

    // Валидация username
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Логин должен содержать минимум 3 символа' },
        { status: 400 }
      )
    }

    // Проверка уникальности email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    // Проверка уникальности username
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    })

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Пользователь с таким логином уже существует' },
        { status: 409 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(password)

    // Проверяем, есть ли уже пользователи в системе
    const usersCount = await prisma.user.count()
    const isFirstUser = usersCount === 0

    console.log(`Total users in system: ${usersCount}, is first user: ${isFirstUser}`)

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        isAdmin: isFirstUser, // Первый пользователь становится администратором
        isActive: true,
      }
    })

    if (isFirstUser) {
      console.log('🎉 First user registered as admin:', user.email)
    }

    console.log('User created in database:', user.email)

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
      message: 'Регистрация прошла успешно',
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
    console.error('Registration error:', error)
    
    // Детализированное логирование для диагностики
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    )
  }
} 