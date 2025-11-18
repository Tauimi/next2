# 🔍 Диагностика проблем с авторизацией на Vercel

## Проблема
При попытке регистрации или авторизации возникает ошибка сервера.

## Возможные причины и решения

### 1. ❌ Отсутствует NEXTAUTH_SECRET

**Проверка:**
```bash
# В Vercel Dashboard → Settings → Environment Variables
# Должна быть переменная NEXTAUTH_SECRET
```

**Решение:**
1. Сгенерируйте секретный ключ:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Добавьте в Vercel:
   - Откройте проект в Vercel Dashboard
   - Settings → Environment Variables
   - Добавьте: `NEXTAUTH_SECRET` = ваш_сгенерированный_ключ
   - Выберите все окружения (Production, Preview, Development)
   - Сохраните

3. **Обязательно сделайте Redeploy!**

### 2. ❌ Неправильный NEXTAUTH_URL

**Проверка:**
```bash
# NEXTAUTH_URL должен совпадать с вашим доменом Vercel
NEXTAUTH_URL="https://ваш-проект.vercel.app"
```

**Решение:**
1. В Vercel Dashboard → Settings → Environment Variables
2. Проверьте/добавьте `NEXTAUTH_URL`
3. Значение должно быть: `https://ваш-проект.vercel.app` (без слэша в конце)
4. Redeploy проекта

### 3. ❌ База данных не подключена

**Проверка:**
Откройте в браузере: `https://ваш-проект.vercel.app/api/health`

Должен вернуть:
```json
{
  "status": "healthy",
  "database": {
    "status": "healthy",
    "latency": 45
  }
}
```

**Если база недоступна:**

#### Вариант A: Vercel Postgres
1. Vercel Dashboard → Storage → Create Database → Postgres
2. Скопируйте все переменные из вкладки `.env.local`
3. Добавьте их в Environment Variables:
   - `DATABASE_URL` (используйте значение `POSTGRES_PRISMA_URL`)
   - `DATABASE_URL_NON_POOLING` (используйте значение `POSTGRES_URL_NON_POOLING`)
4. Redeploy

#### Вариант B: Внешняя база (Supabase, Neon и т.д.)
1. Получите строку подключения от провайдера
2. Добавьте в Vercel Environment Variables:
   - `DATABASE_URL` = ваша строка подключения
   - `DATABASE_URL_NON_POOLING` = та же строка (или без pooling параметров)
3. Redeploy

### 4. ❌ Схема базы данных не применена

**Проверка:**
После подключения БД нужно применить схему Prisma.

**Решение:**

#### Способ 1: Через Vercel CLI (рекомендуется)
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Подключитесь к проекту
vercel link

# Примените схему БД
vercel env pull .env.local
npx prisma db push
```

#### Способ 2: Через GitHub Actions
Создайте файл `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx prisma generate
      - run: npx prisma db push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

#### Способ 3: Вручную через SQL
Если у вас есть доступ к SQL консоли вашей БД, выполните SQL из файла `prisma/schema.prisma`.

### 5. ❌ Проблемы с CORS или cookies

**Решение:**
Убедитесь что в `lib/auth.ts` правильно настроены cookies:

```typescript
response.cookies.set('auth-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ✅ Должно быть true на Vercel
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
})
```

### 6. ❌ Ошибка в логах Vercel

**Как посмотреть логи:**
1. Vercel Dashboard → ваш проект
2. Deployments → последний деплой
3. Functions → найдите `/api/auth/register` или `/api/auth/login`
4. Посмотрите логи ошибок

**Типичные ошибки:**

#### "PrismaClientInitializationError"
- Проблема с подключением к БД
- Проверьте DATABASE_URL

#### "Invalid `prisma.user.create()` invocation"
- Проблема со схемой БД
- Выполните `npx prisma db push`

#### "NEXTAUTH_SECRET is required"
- Отсутствует переменная окружения
- Добавьте NEXTAUTH_SECRET в Vercel

## 🔧 Быстрая диагностика

### Шаг 1: Проверьте переменные окружения
```bash
# В Vercel Dashboard → Settings → Environment Variables
# Должны быть:
✅ DATABASE_URL
✅ DATABASE_URL_NON_POOLING (опционально)
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
```

### Шаг 2: Проверьте здоровье системы
Откройте: `https://ваш-проект.vercel.app/api/health`

### Шаг 3: Проверьте логи
Vercel Dashboard → Deployments → Functions → Logs

### Шаг 4: Попробуйте зарегистрироваться
1. Откройте DevTools (F12)
2. Вкладка Network
3. Попробуйте зарегистрироваться
4. Посмотрите ответ от `/api/auth/register`

## 📝 Чеклист для успешного деплоя

- [ ] База данных создана и доступна
- [ ] DATABASE_URL добавлен в Vercel Environment Variables
- [ ] NEXTAUTH_SECRET сгенерирован и добавлен
- [ ] NEXTAUTH_URL соответствует домену Vercel
- [ ] Схема Prisma применена (`npx prisma db push`)
- [ ] Проект переdeployен после добавления переменных
- [ ] `/api/health` возвращает "healthy"
- [ ] Логи Vercel не показывают ошибок

## 🆘 Если ничего не помогло

1. **Создайте тестовый endpoint для диагностики:**

Создайте файл `app/api/debug/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Проверка переменных окружения
    const envCheck = {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    }

    // Проверка БД
    let dbCheck = { status: 'unknown' }
    try {
      await prisma.$queryRaw`SELECT 1`
      dbCheck = { status: 'connected' }
    } catch (error) {
      dbCheck = { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // Проверка таблиц
    let tablesCheck = { status: 'unknown' }
    try {
      const userCount = await prisma.user.count()
      tablesCheck = { status: 'ok', userCount }
    } catch (error) {
      tablesCheck = { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    return NextResponse.json({
      environment: envCheck,
      database: dbCheck,
      tables: tablesCheck,
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug check failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
```

2. **Откройте:** `https://ваш-проект.vercel.app/api/debug`

3. **Отправьте результат** - это поможет точно определить проблему.

## 📞 Дополнительная помощь

Если проблема не решается:
1. Проверьте документацию Vercel: https://vercel.com/docs
2. Проверьте документацию Prisma: https://www.prisma.io/docs
3. Посмотрите логи в Vercel Dashboard
4. Проверьте статус вашего провайдера БД
