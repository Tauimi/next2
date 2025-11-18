import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

// Функция для создания Prisma Client с поддержкой Accelerate
const createPrismaClient = () => {
  const baseClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  // Если используется Prisma Accelerate (prisma://), то расширяем клиент
  if (process.env.DATABASE_URL?.startsWith('prisma://')) {
    try {
      // Динамический импорт для избежания ошибок при отсутствии пакета
      const { withAccelerate } = require('@prisma/extension-accelerate')
      return baseClient.$extends(withAccelerate())
    } catch (error) {
      console.warn('Prisma Accelerate extension not found, using regular client')
      return baseClient
    }
  }

  return baseClient
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 