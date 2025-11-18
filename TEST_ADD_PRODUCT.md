# 🧪 Тест добавления товара

## Проблема
API возвращает 400 ошибку при добавлении товара.

## Быстрый тест через curl

Откройте терминал и выполните:

```bash
# Сначала создайте категорию
curl -X POST https://next2-pi-ten.vercel.app/api/categories \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=ВАШ_ТОКЕН" \
  -d '{"name":"Смартфоны","slug":"smartphones","isActive":true}'
```

Скопируйте `id` из ответа, затем:

```bash
# Создайте товар с этим ID
curl -X POST https://next2-pi-ten.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=ВАШ_ТОКЕН" \
  -d '{
    "name":"iPhone 15 Pro",
    "description":"Флагманский смартфон",
    "price":119990,
    "categoryId":"ID_ИЗ_ПРЕДЫДУЩЕГО_ОТВЕТА"
  }'
```

## Или через браузер Console

Откройте Console (F12) и выполните:

```javascript
// 1. Создайте категорию
fetch('/api/categories', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',
  body: JSON.stringify({
    name: 'Смартфоны',
    slug: 'smartphones',
    isActive: true
  })
}).then(r => r.json()).then(console.log)

// 2. Скопируйте ID из ответа и создайте товар
fetch('/api/products', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',
  body: JSON.stringify({
    name: 'iPhone 15 Pro',
    description: 'Флагманский смартфон от Apple',
    price: 119990,
    categoryId: 'ВСТАВЬТЕ_ID_КАТЕГОРИИ_СЮДА'
  })
}).then(r => r.json()).then(console.log)
```

## Проверка через Network tab

1. Откройте DevTools (F12)
2. Вкладка **Network**
3. Попробуйте добавить товар
4. Найдите запрос `/api/products`
5. Кликните на него
6. Вкладка **Response** - там будет точная ошибка!

Скопируйте текст из Response и покажите мне.
