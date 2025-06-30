# 🚀 Быстрая настройка TechnoMart

## 📋 Шаг 1: Создайте базу данных

### Вариант А: Vercel Postgres (рекомендуется)
1. Откройте: https://vercel.com/dashboard
2. Выберите/создайте ваш проект
3. Перейдите в **Storage** → **Create Database** → **Postgres**
4. Название: `technomart-db`, выберите регион
5. **Важно:** Скопируйте все переменные окружения из вкладки `.env.local`

### Вариант Б: Supabase
1. Перейдите на: https://supabase.com/
2. Создайте новый проект с PostgreSQL базой данных
3. Скопируйте строку подключения (DATABASE_URL) из Settings → Database

## 📋 Шаг 2: Настройте окружение

Создайте файл `.env.local`:

**Для Vercel Postgres** (скопируйте переменные из Vercel Dashboard):
```env
# Vercel Postgres (скопируйте из Dashboard → Storage → ваша БД → .env.local)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Основные переменные для приложения
DATABASE_URL="postgres://..." # Используйте значение POSTGRES_PRISMA_URL
DATABASE_URL_NON_POOLING="postgres://..." # Используйте значение POSTGRES_URL_NON_POOLING

# Authentication
NEXTAUTH_SECRET="your-random-secret-32-chars-minimum"
NEXTAUTH_URL="http://localhost:3000"
```

**Для других провайдеров:**
```env
# Обычная строка подключения
DATABASE_URL="postgresql://username:password@host:5432/database"
DATABASE_URL_NON_POOLING="postgresql://username:password@host:5432/database"
NEXTAUTH_SECRET="your-random-secret-32-chars-minimum"
NEXTAUTH_URL="http://localhost:3000"
```

## 📋 Шаг 3: Инициализация

```bash
# Установите зависимости
npm install

# Создайте схему базы данных
npx prisma db push

# Запустите проект
npm run dev
```

## ✅ Проверка работоспособности

После запуска проверьте:

1. **Сайт:** http://localhost:3000/
2. **Здоровье БД:** http://localhost:3000/api/health
3. **Регистрация:** Первый пользователь автоматически станет администратором

## 🔧 Полезные команды

```bash
# Просмотр базы данных
npx prisma studio

# Сброс базы данных
npx prisma db push --force-reset

# Проверка схемы
npx prisma validate

# Генерация клиента
npx prisma generate
```

## 🚨 Важные изменения

### Переменные окружения обновлены:
- ✅ `DATABASE_URL` - основное подключение
- ✅ `DATABASE_URL_NON_POOLING` - прямое подключение без пулинга
- ❌ `PRISMA_DATABASE_URL` - больше не используется

### Новые возможности:
- 🔍 **Мониторинг БД:** `/api/health` для проверки состояния
- ⚡ **Retry логика:** Автоматические повторы при сбоях
- 📊 **Улучшенная производительность:** Оптимизированные запросы и индексы
- 🛡️ **Безопасность:** Валидация данных и защита от SQL injection

## 🎯 Первый запуск

1. Зарегистрируйтесь на сайте - вы автоматически станете администратором
2. Перейдите в админ-панель: `/admin`
3. Создайте категории и товары
4. Проверьте работу корзины и заказов

Готово! 🎉 