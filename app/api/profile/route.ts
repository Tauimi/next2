import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// Указываем что роут должен быть динамическим
export const dynamic = 'force-dynamic'

// GET /api/profile - Получение профиля пользователя
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    // Получаем полную информацию о пользователе
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // address: true, // TODO: добавить поле address в схему
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: profile
    })

  } catch (error) {
    console.error('Profile GET Error:', error)
    return NextResponse.json(
      { error: 'Ошибка получения профиля' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Обновление профиля пользователя
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      // address, // TODO: добавить когда будет поле в схеме
    } = body

    // Валидация данных
    const updateData: any = {}

    if (firstName !== undefined) {
      updateData.firstName = firstName.trim()
    }

    if (lastName !== undefined) {
      updateData.lastName = lastName.trim()
    }

    if (phone !== undefined) {
      // Простая валидация телефона
      const phoneRegex = /^(\+7|8|7)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
      if (phone.trim() && !phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Неверный формат номера телефона' },
          { status: 400 }
        )
      }
      updateData.phone = phone.trim()
    }

    // TODO: добавить валидацию address когда поле будет в схеме
    // if (address !== undefined) {
    //   updateData.address = address.trim()
    // }

    // Обновляем профиль
    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Профиль успешно обновлен'
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления профиля' },
      { status: 500 }
    )
  }
} 