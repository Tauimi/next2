import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Проверка переменных окружения
    const envCheck = {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
      nodeEnv: process.env.NODE_ENV,
    }

    // Проверка БД подключения
    let dbCheck: Record<string, unknown> = { status: 'unknown' }
    try {
      const start = Date.now()
      await prisma.$queryRaw`SELECT 1`
      const latency = Date.now() - start
      dbCheck = { status: 'connected', latency }
    } catch (error) {
      dbCheck = { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code
      }
    }

    // Проверка таблиц
    let tablesCheck: Record<string, unknown> = { status: 'unknown' }
    try {
      const userCount = await prisma.user.count()
      const productCount = await prisma.product.count()
      const categoryCount = await prisma.category.count()
      
      tablesCheck = { 
        status: 'ok', 
        userCount,
        productCount,
        categoryCount,
        firstUserIsAdmin: userCount === 0 ? 'N/A - no users yet' : 'Check after registration'
      }
    } catch (error) {
      tablesCheck = { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Tables might not exist. Run: npx prisma db push'
      }
    }

    // Проверка JWT
    let jwtCheck: Record<string, unknown> = { status: 'unknown' }
    try {
      const { createToken, verifyToken } = await import('@/lib/auth')
      const testToken = createToken({
        userId: 'test',
        email: 'test@test.com',
        username: 'test',
        isAdmin: false
      })
      const verified = verifyToken(testToken)
      jwtCheck = { 
        status: verified ? 'ok' : 'error',
        canCreateToken: !!testToken,
        canVerifyToken: !!verified
      }
    } catch (error) {
      jwtCheck = { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbCheck,
      tables: tablesCheck,
      jwt: jwtCheck,
      recommendations: getRecommendations(envCheck, dbCheck, tablesCheck, jwtCheck)
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug check failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    )
  }
}

function getRecommendations(
  env: Record<string, unknown>, 
  db: Record<string, unknown>, 
  tables: Record<string, unknown>, 
  jwt: Record<string, unknown>
): string[] {
  const recommendations: string[] = []

  // Проверка переменных окружения
  if (!env.hasNextAuthSecret) {
    recommendations.push('❌ CRITICAL: NEXTAUTH_SECRET is missing! Add it to Vercel Environment Variables.')
  } else if (typeof env.nextAuthSecretLength === 'number' && env.nextAuthSecretLength < 32) {
    recommendations.push('⚠️ WARNING: NEXTAUTH_SECRET is too short (should be at least 32 characters).')
  }

  if (!env.hasNextAuthUrl) {
    recommendations.push('❌ CRITICAL: NEXTAUTH_URL is missing! Add it to Vercel Environment Variables.')
  } else if (typeof env.nextAuthUrl === 'string' && !env.nextAuthUrl.startsWith('https://')) {
    recommendations.push('⚠️ WARNING: NEXTAUTH_URL should start with https:// in production.')
  }

  if (!env.hasDatabaseUrl) {
    recommendations.push('❌ CRITICAL: DATABASE_URL is missing! Add it to Vercel Environment Variables.')
  }

  // Проверка БД
  if (db.status === 'error') {
    recommendations.push(`❌ DATABASE ERROR: ${db.message}. Check your DATABASE_URL.`)
  } else if (db.status === 'connected') {
    recommendations.push(`✅ Database connected successfully (latency: ${db.latency}ms).`)
  }

  // Проверка таблиц
  if (tables.status === 'error') {
    recommendations.push('❌ TABLES ERROR: Database schema not applied. Run: npx prisma db push')
  } else if (tables.status === 'ok') {
    recommendations.push(`✅ Database tables exist (${tables.userCount} users, ${tables.productCount} products).`)
    if (tables.userCount === 0) {
      recommendations.push('💡 TIP: First registered user will become admin automatically.')
    }
  }

  // Проверка JWT
  if (jwt.status === 'error') {
    recommendations.push(`❌ JWT ERROR: ${jwt.message}`)
  } else if (jwt.status === 'ok') {
    recommendations.push('✅ JWT authentication is working correctly.')
  }

  // Общие рекомендации
  if (recommendations.filter(r => r.startsWith('❌')).length === 0) {
    recommendations.push('🎉 All checks passed! Your application should work correctly.')
    recommendations.push('📝 Next step: Try to register a new user.')
  } else {
    recommendations.push('🔧 Fix the issues above and redeploy your application.')
  }

  return recommendations
}
