import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET

if (!JWT_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required')
}

export interface JWTPayload {
  userId: string
  email: string
  username: string
  isAdmin: boolean
}

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Проверка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Создание JWT токена
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { 
    expiresIn: '7d' 
  })
}

// Проверка JWT токена
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JWTPayload
  } catch {
    return null
  }
}

// Получение пользователя из запроса
export async function getUserFromRequest(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('auth-token')?.value

    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        isActive: true,
      }
    })

    return user
  } catch {
    return null
  }
}

// Проверка прав администратора
export async function requireAdmin(request: NextRequest) {
  const user = await getUserFromRequest(request)
  
  if (!user || !user.isAdmin) {
    throw new Error('Access denied: Admin required')
  }

  return user
}

// Проверка авторизации пользователя
export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request)
  
  if (!user || !user.isActive) {
    throw new Error('Access denied: Authentication required')
  }

  return user
} 