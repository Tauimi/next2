# Переменные окружения для TechnoMart

## Для локальной разработки (.env.local)

```bash
# База данных (обычная PostgreSQL для локальной разработки)
DATABASE_URL="postgresql://username:password@localhost:5432/technomart?schema=public"
DATABASE_URL_NON_POOLING="postgresql://username:password@localhost:5432/technomart?schema=public"

# Аутентификация
NEXTAUTH_SECRET="ваш_секретный_ключ_32_символа_минимум"
NEXTAUTH_URL="http://localhost:3000"

# Режим работы
NODE_ENV="development"
```

## Для Vercel деплоя

```bash
# База данных (Prisma Postgres с Accelerate)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=ваш_api_ключ"

# Аутентификация
NEXTAUTH_SECRET="тот_же_секретный_ключ_что_и_локально"
NEXTAUTH_URL="https://ваш-проект.vercel.app"

# Режим работы
NODE_ENV="production"
```

## Генерация секретного ключа

Для создания NEXTAUTH_SECRET выполните в терминале:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Настройка переменных в Vercel

1. В панели Vercel откройте настройки проекта
2. Перейдите в раздел **Environment Variables**
3. Добавьте все переменные из раздела "Для Vercel деплоя"
4. Сохраните и переdeployите проект

## Важные замечания

- **DATABASE_URL** автоматически определяется нашим Prisma Client
- Если URL начинается с `prisma://`, используется Accelerate extension
- Если URL начинается с `postgresql://`, используется обычный клиент
- Первый зарегистрированный пользователь автоматически становится администратором 