import { prisma } from './prisma'

// Retry логика для операций с БД
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Логируем попытку
      console.warn(`Database operation failed (attempt ${i + 1}/${maxRetries}):`, lastError.message)
      
      // Если это последняя попытка, не ждем
      if (i < maxRetries - 1) {
        // Экспоненциальная задержка
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError!
}

// Мониторинг медленных запросов
export function setupQueryMonitoring() {
  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query' as never, (e: any) => {
      if (e.duration > 1000) {
        console.warn(`🐌 Slow query detected: ${e.duration}ms`)
        console.warn(`Query: ${e.query}`)
        console.warn(`Params: ${e.params}`)
      }
    })

    prisma.$on('error' as never, (e: any) => {
      console.error('🚨 Database error:', e)
    })
  }
}

// Проверка здоровья БД
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  latency?: number
  error?: string
}> {
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - start
    
    return {
      status: 'healthy',
      latency
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message
    }
  }
}

// Безопасное получение пагинации
export function getSafePagination(
  page?: string | null,
  limit?: string | null,
  maxLimit = 100,
  defaultLimit = 12
) {
  const parsedPage = Math.max(1, parseInt(page || '1'))
  const parsedLimit = Math.min(
    Math.max(1, parseInt(limit || defaultLimit.toString())),
    maxLimit
  )
  
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
    take: parsedLimit
  }
}

// Типобезопасные фильтры для поиска
export function buildSearchFilters(searchTerm?: string | null) {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return {}
  }

  const term = searchTerm.trim()
  
  return {
    OR: [
      { name: { contains: term, mode: 'insensitive' as const } },
      { description: { contains: term, mode: 'insensitive' as const } },
      { sku: { contains: term, mode: 'insensitive' as const } }
    ]
  }
}

// Оптимизированные include для товаров
export const optimizedProductInclude = {
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
    where: { isPrimary: true },
    take: 1,
    select: {
      url: true,
      alt: true
    }
  }
}

// Транзакция с таймаутом
export async function safeTransaction<T>(
  operation: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
  options: {
    maxWait?: number
    timeout?: number
  } = {}
): Promise<T> {
  const { maxWait = 5000, timeout = 10000 } = options
  
  return withRetry(
    () => prisma.$transaction(operation, { maxWait, timeout }),
    2 // Меньше попыток для транзакций
  )
}

// Инициализация мониторинга
setupQueryMonitoring() 