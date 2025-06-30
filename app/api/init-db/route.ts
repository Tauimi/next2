import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting database initialization...')
    
    // Проверяем, можем ли мы подключиться к БД
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ Database connection successful')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        },
        { status: 500 }
      )
    }

    // Проверяем, существуют ли уже таблицы
    try {
      const userCount = await prisma.user.count()
      console.log('ℹ️ Database already initialized, user count:', userCount)
      
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        userCount,
        status: 'already_initialized'
      })
    } catch (error) {
      // Если таблицы не существуют, продолжаем инициализацию
      console.log('🔧 Tables do not exist, proceeding with initialization...')
    }

    // Выполняем создание схемы через Prisma
    console.log('🔨 Running prisma db push...')
    
    // Создаем таблицы через прямые SQL команды как fallback
    try {
      // Создаем таблицу пользователей
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          "phone" TEXT,
          "role" TEXT NOT NULL DEFAULT 'USER',
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "emailVerified" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
      `)

      // Создаем уникальный индекс для email
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
      `)

      // Создаем таблицу категорий
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Category" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "description" TEXT,
          "image" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
        );
      `)

      // Создаем уникальный индекс для slug категории
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
      `)

      // Создаем таблицу продуктов
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Product" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "description" TEXT,
          "shortDescription" TEXT,
          "price" DECIMAL(10,2) NOT NULL,
          "oldPrice" DECIMAL(10,2),
          "sku" TEXT NOT NULL,
          "stock" INTEGER NOT NULL DEFAULT 0,
          "images" TEXT[],
          "specifications" JSONB,
          "categoryId" TEXT NOT NULL,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "isFeatured" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
        );
      `)

      // Создаем индексы для продуктов
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");
        CREATE UNIQUE INDEX IF NOT EXISTS "Product_sku_key" ON "Product"("sku");
        CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
      `)

      // Создаем внешний ключ для продуктов
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'Product_categoryId_fkey'
          ) THEN
            ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
            FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
          END IF;
        END $$;
      `)

      // Создаем остальные таблицы
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CartItem" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "WishlistItem" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CompareItem" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "CompareItem_pkey" PRIMARY KEY ("id")
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Order" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'PENDING',
          "total" DECIMAL(10,2) NOT NULL,
          "customerInfo" JSONB NOT NULL,
          "deliveryInfo" JSONB NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "OrderItem" (
          "id" TEXT NOT NULL,
          "orderId" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL,
          "price" DECIMAL(10,2) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
        );
      `)

      console.log('✅ All tables created successfully')

      // Создаем начальные данные - категорию по умолчанию
      try {
        await prisma.category.create({
          data: {
            id: 'default-category',
            name: 'Общие товары',
            slug: 'general',
            description: 'Категория по умолчанию для всех товаров'
          }
        })
        console.log('✅ Default category created')
      } catch (error) {
        console.log('ℹ️ Default category already exists or failed to create:', error)
      }

      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        status: 'initialized'
      })

    } catch (error) {
      console.error('❌ Database initialization failed:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database initialization failed', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Unexpected error during initialization:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Unexpected error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 