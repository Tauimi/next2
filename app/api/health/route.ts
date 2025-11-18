import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Проверяем здоровье базы данных
    const dbHealth = await checkDatabaseHealth()
    
    // Общий статус системы
    const systemHealth = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        status: dbHealth.status,
        latency: dbHealth.latency,
        error: dbHealth.error
      },
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    }

    // Возвращаем соответствующий HTTP статус
    const httpStatus = systemHealth.status === 'healthy' ? 200 : 503

    return NextResponse.json(systemHealth, { status: httpStatus })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        database: {
          status: 'unhealthy',
          error: 'Health check failed'
        }
      },
      { status: 503 }
    )
  }
} 