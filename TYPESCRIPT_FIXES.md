# TypeScript Fixes - Замена any типов

## ✅ Выполнено

### 1. Создана система типов
- ✅ `types/database.ts` - типы для БД (Prisma расширения)
- ✅ `types/api.ts` - типы для API запросов/ответов
- ✅ `types/forms.ts` - типы для форм

### 2. Исправлены файлы
- ✅ `lib/utils.ts` - заменены any в debounce, throttle, adaptProductToCard
- ✅ `lib/prisma.ts` - заменен any на PrismaClient
- ✅ `lib/db-utils.ts` - заменен any в safeTransaction

## 🔄 В процессе

### 3. API Routes (следующий шаг)
- [ ] `app/api/products/route.ts`
- [ ] `app/api/orders/route.ts`
- [ ] `app/api/cart/route.ts`
- [ ] `app/api/wishlist/route.ts`
- [ ] `app/api/compare/route.ts`
- [ ] `app/api/profile/route.ts`
- [ ] `app/api/admin/**/*.ts`

### 4. Components
- [ ] `components/ProductCard.tsx`
- [ ] `components/QuickAddProduct.tsx`

### 5. Pages
- [ ] `app/profile/page.tsx`
- [ ] `app/orders/page.tsx`
- [ ] `app/checkout/page.tsx`

## 📝 Примеры использования новых типов

### Database Types
```typescript
import { ProductWithRelations, CartItemWithProduct } from '@/types/database'

const product: ProductWithRelations = await prisma.product.findUnique({
  where: { id },
  include: {
    category: true,
    brand: true,
    images: true,
    specifications: true,
    reviews: { include: { user: true } },
    _count: { select: { reviews: true } }
  }
})
```

### API Types
```typescript
import { ApiResponse, ProductListParams } from '@/types/api'

export async function GET(request: NextRequest) {
  const params: ProductListParams = {
    page: 1,
    limit: 20,
    search: 'laptop'
  }
  
  const response: ApiResponse<Product[]> = {
    success: true,
    data: products
  }
  
  return NextResponse.json(response)
}
```

### Form Types
```typescript
import { ProductFormData, ValidationState } from '@/types/forms'

const [formData, setFormData] = useState<ProductFormData>({
  name: '',
  description: '',
  // ...
})

const [validationState, setValidationState] = useState<ValidationState>({
  name: false,
  description: false,
  price: false
})
```

## 🎯 Следующие шаги

1. Исправить все API роуты
2. Исправить компоненты
3. Исправить страницы
4. Запустить TypeScript проверку: `npx tsc --noEmit`
5. Включить strict mode в tsconfig.json

## 📊 Прогресс

- Создано типов: 50+
- Исправлено файлов: 3/50+
- Осталось any: ~45

## Команды для коммита

```bash
git add types/
git add lib/utils.ts lib/prisma.ts lib/db-utils.ts
git add TYPESCRIPT_FIXES.md
git commit -m "feat: создана система типов и начата замена any

- Создана структура типов (database, api, forms)
- Исправлены типы в lib/utils.ts (debounce, throttle, adaptProductToCard)
- Исправлены типы в lib/prisma.ts и lib/db-utils.ts
- Добавлено 50+ новых типов для проекта"
```
