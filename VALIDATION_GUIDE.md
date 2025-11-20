# Руководство по валидации форм

## 📋 Обзор

Система валидации форм для TechnoMart включает:
- Утилиты валидации (`lib/validation.ts`)
- Компоненты с валидацией (`ValidatedInput`, `ValidatedTextarea`)
- Готовые правила для всех типов полей

## 🛠️ Утилиты валидации

### Доступные функции

```typescript
import {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
  validateCity,
  validateZipCode,
  validateMessage,
  validateField,
  formatPhone,
  formatZipCode
} from '@/lib/validation'
```

### Примеры использования

#### Email
```typescript
const result = validateEmail('user@example.com')
// { isValid: true }

const result = validateEmail('invalid')
// { isValid: false, error: 'Введите корректный email адрес' }
```

#### Телефон
```typescript
const result = validatePhone('+7 (900) 123-45-67')
// { isValid: true }

const result = validatePhone('123')
// { isValid: false, error: 'Введите корректный номер телефона (11 цифр)' }
```

#### Имя
```typescript
const result = validateName('Иван Иванов')
// { isValid: true }

const result = validateName('А')
// { isValid: false, error: 'Имя должно содержать минимум 2 символа' }
```

#### Адрес
```typescript
const result = validateAddress('ул. Ленина, д. 1, кв. 10')
// { isValid: true }
```

#### Город
```typescript
const result = validateCity('Москва')
// { isValid: true }

const result = validateCity('123')
// { isValid: false, error: 'Название города должно содержать только буквы' }
```

#### Почтовый индекс
```typescript
const result = validateZipCode('123456')
// { isValid: true }

const result = validateZipCode('123')
// { isValid: false, error: 'Почтовый индекс должен содержать 6 цифр' }
```

#### Сообщение
```typescript
const result = validateMessage('Здравствуйте, у меня вопрос...')
// { isValid: true }

const result = validateMessage('Hi')
// { isValid: false, error: 'Сообщение должно содержать минимум 10 символов' }
```

### Форматирование

#### Телефон
```typescript
formatPhone('79001234567')
// '+7 (900) 123-45-67'
```

#### Почтовый индекс
```typescript
formatZipCode('abc123456def')
// '123456'
```

## 🎨 Компоненты с валидацией

### ValidatedInput

```typescript
import { ValidatedInput } from '@/components/ui/ValidatedInput'

<ValidatedInput
  label="Email"
  type="email"
  placeholder="your@email.com"
  validationRules={{
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Введите корректный email'
  }}
  onChange={(value) => setEmail(value)}
  onValidationChange={(result) => {
    console.log('Valid:', result.isValid)
  }}
/>
```

### ValidatedTextarea

```typescript
import { ValidatedTextarea } from '@/components/ui/ValidatedTextarea'

<ValidatedTextarea
  label="Сообщение"
  placeholder="Ваше сообщение..."
  rows={4}
  validationRules={{
    required: true,
    minLength: 10,
    maxLength: 1000
  }}
  showCharCount
  onChange={(value) => setMessage(value)}
/>
```

## 📝 Правила валидации

### ValidationRule интерфейс

```typescript
interface ValidationRule {
  required?: boolean          // Обязательное поле
  minLength?: number         // Минимальная длина
  maxLength?: number         // Максимальная длина
  pattern?: RegExp           // Регулярное выражение
  custom?: (value: string) => boolean  // Кастомная функция
  message?: string           // Кастомное сообщение об ошибке
}
```

### Примеры правил

#### Обязательное поле
```typescript
{
  required: true,
  message: 'Это поле обязательно'
}
```

#### Длина строки
```typescript
{
  required: true,
  minLength: 2,
  maxLength: 100,
  message: 'От 2 до 100 символов'
}
```

#### Email
```typescript
{
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Введите корректный email'
}
```

#### Телефон
```typescript
{
  required: true,
  pattern: /^[\d\s\+\-\(\)]+$/,
  minLength: 11,
  message: 'Введите корректный номер телефона'
}
```

#### Кастомная валидация
```typescript
{
  required: true,
  custom: (value) => value.includes('@'),
  message: 'Значение должно содержать @'
}
```

## 🔧 Примеры использования в формах

### Форма контактов

```typescript
'use client'

import { useState } from 'react'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { ValidatedTextarea } from '@/components/ui/ValidatedTextarea'
import { Button } from '@/components/ui/Button'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [validationState, setValidationState] = useState({
    name: false,
    email: false,
    phone: false,
    message: false
  })

  const isFormValid = Object.values(validationState).every(v => v)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      // Отправка формы
      console.log('Form data:', formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ValidatedInput
        label="Имя"
        placeholder="Ваше имя"
        validationRules={{
          required: true,
          minLength: 2,
          maxLength: 100
        }}
        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
        onValidationChange={(result) => 
          setValidationState(prev => ({ ...prev, name: result.isValid }))
        }
      />

      <ValidatedInput
        label="Email"
        type="email"
        placeholder="your@email.com"
        validationRules={{
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Введите корректный email'
        }}
        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        onValidationChange={(result) => 
          setValidationState(prev => ({ ...prev, email: result.isValid }))
        }
      />

      <ValidatedInput
        label="Телефон"
        type="tel"
        placeholder="+7 (900) 123-45-67"
        validationRules={{
          required: true,
          pattern: /^[\d\s\+\-\(\)]+$/,
          minLength: 11
        }}
        onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
        onValidationChange={(result) => 
          setValidationState(prev => ({ ...prev, phone: result.isValid }))
        }
      />

      <ValidatedTextarea
        label="Сообщение"
        placeholder="Ваше сообщение..."
        rows={4}
        validationRules={{
          required: true,
          minLength: 10,
          maxLength: 1000
        }}
        showCharCount
        onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
        onValidationChange={(result) => 
          setValidationState(prev => ({ ...prev, message: result.isValid }))
        }
      />

      <Button type="submit" disabled={!isFormValid}>
        Отправить
      </Button>
    </form>
  )
}
```

## ✅ Лучшие практики

### 1. Всегда используйте валидацию для пользовательского ввода
```typescript
// ❌ Плохо
<input type="email" />

// ✅ Хорошо
<ValidatedInput
  type="email"
  validationRules={{ required: true, pattern: /email-regex/ }}
/>
```

### 2. Показывайте ошибки только после взаимодействия
```typescript
// Ошибка показывается только после blur
<ValidatedInput showErrorOnBlur={true} />
```

### 3. Отключайте кнопку отправки если форма невалидна
```typescript
const isFormValid = Object.values(validationState).every(v => v)

<Button type="submit" disabled={!isFormValid}>
  Отправить
</Button>
```

### 4. Используйте готовые функции валидации
```typescript
// ❌ Плохо - своя валидация
const isValidEmail = (email) => email.includes('@')

// ✅ Хорошо - готовая функция
import { validateEmail } from '@/lib/validation'
const result = validateEmail(email)
```

### 5. Форматируйте ввод автоматически
```typescript
import { formatPhone } from '@/lib/validation'

<ValidatedInput
  type="tel"
  onChange={(value) => {
    const formatted = formatPhone(value)
    setPhone(formatted)
  }}
/>
```

## 🎯 Где применять

### Обязательно:
- ✅ Формы оформления заказа
- ✅ Формы регистрации/входа
- ✅ Формы обратной связи
- ✅ Формы заказа услуг
- ✅ Формы редактирования профиля

### Рекомендуется:
- ✅ Поля поиска (минимальная длина)
- ✅ Комментарии и отзывы
- ✅ Формы подписки

### Не обязательно:
- ⚠️ Фильтры каталога
- ⚠️ Необязательные поля

## 📊 Типы валидации

| Поле | Функция | Правила |
|------|---------|---------|
| Email | `validateEmail` | Формат email |
| Телефон | `validatePhone` | 11 цифр, начинается с 7/8 |
| Имя | `validateName` | 2-100 символов, буквы |
| Адрес | `validateAddress` | 5-200 символов |
| Город | `validateCity` | 2+ символа, только буквы |
| Индекс | `validateZipCode` | 6 цифр |
| Сообщение | `validateMessage` | 10-1000 символов |

## 🚀 Следующие шаги

1. Обновить форму checkout с валидацией
2. Обновить форму контактов
3. Обновить форму услуг
4. Обновить форму регистрации
5. Добавить валидацию в админ-панель
