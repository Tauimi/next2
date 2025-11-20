# TechnoMart Style Guide

## 🎨 Система дизайна

### Цветовая палитра

```tsx
// Основные цвета
primary: #3b82f6 (синий)
secondary: #64748b (серый)
accent: #f59e0b (оранжевый)

// Статусные цвета
success: #10b981 (зеленый)
warning: #f59e0b (желтый)
error: #ef4444 (красный)
```

### Типографика

```tsx
// Шрифты
font-display: Inter (заголовки)
font-body: system-ui (основной текст)
font-accent: Montserrat (акценты)

// Размеры
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 26px (золотое сечение)
text-3xl: 42px (золотое сечение)
```

## 🧩 Переиспользуемые компоненты

### Section (Секции)

```tsx
import { Section, SectionHeader, SectionContainer } from '@/components/ui/Section'

// Обычная секция
<Section variant="default">
  <SectionContainer>
    <SectionHeader 
      title="Заголовок" 
      subtitle="Подзаголовок" 
    />
    {/* Контент */}
  </SectionContainer>
</Section>

// Градиентная секция
<Section variant="gradient">
  <SectionContainer>
    <SectionHeader title="Заголовок" />
    {/* Весь текст автоматически белый */}
  </SectionContainer>
</Section>

// Варианты: default | muted | gradient | dark
// Размеры контейнера: sm | md | lg | xl | full
```

### Card (Карточки)

```tsx
import { Card, IconCard, StepCard } from '@/components/ui/Card'

// Обычная карточка
<Card variant="muted">
  <h3>Заголовок</h3>
  <p>Описание</p>
</Card>

// Карточка с иконкой
<IconCard
  icon={<Icon className="w-8 h-8 text-primary" />}
  title="Заголовок"
  description="Описание"
  centered
>
  {/* Дополнительный контент */}
</IconCard>

// Карточка шага
<StepCard
  step={1}
  title="Шаг 1"
  description="Описание шага"
/>

// Варианты: default | muted | white | hover
```

### Badge (Бейджи)

```tsx
import { Badge, CategoryBadge } from '@/components/ui/Badge'

// Обычный бейдж
<Badge variant="primary" size="md">
  Новинка
</Badge>

// Бейдж категории
<CategoryBadge>
  Смартфоны
</CategoryBadge>

// Варианты: primary | secondary | success | warning | error | accent
// Размеры: sm | md | lg
```

### Stats (Статистика)

```tsx
import { Stat, StatsGrid } from '@/components/ui/Stats'

<StatsGrid columns={4}>
  <Stat value="150+" label="Проектов" />
  <Stat value="120+" label="Клиентов" />
  <Stat value="10+" label="Лет опыта" />
  <Stat value="500+" label="Млн рублей" />
</StatsGrid>

// Колонки: 2 | 3 | 4
```

## 🎯 Утилитарные классы

### Секции

```css
/* Градиентная секция - автоматически белый текст */
.section-gradient

/* Применяется к <section className="section-gradient"> */
/* Все внутри автоматически белое, кроме форм и кнопок */
```

### Карточки

```css
.card-muted      /* bg-muted/50 rounded-xl p-6 */
.card-white      /* bg-white rounded-xl p-6 shadow-sm */
.card-hover      /* с эффектом hover */
```

### Иконки

```css
.icon-circle          /* Круг с иконкой (светлый фон) */
.icon-circle-primary  /* Круг с иконкой (primary фон) */
```

### Бейджи

```css
.badge               /* Базовый бейдж */
.badge-primary       /* Синий */
.badge-success       /* Зеленый */
.badge-warning       /* Желтый */
.badge-error         /* Красный */
```

### Типографика

```css
.text-subtitle       /* text-xl text-muted-foreground */
.text-description    /* text-muted-foreground */
.text-small          /* text-sm text-muted-foreground */
```

## ✅ Лучшие практики

### 1. Используйте компоненты вместо повторяющихся классов

❌ **Плохо:**
```tsx
<div className="bg-muted/50 rounded-xl p-6">
  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
    <Icon />
  </div>
  <h3 className="text-xl font-bold mb-3">Заголовок</h3>
  <p className="text-muted-foreground">Описание</p>
</div>
```

✅ **Хорошо:**
```tsx
<IconCard
  icon={<Icon className="w-8 h-8 text-primary" />}
  title="Заголовок"
  description="Описание"
/>
```

### 2. Используйте section-gradient для градиентных секций

❌ **Плохо:**
```tsx
<section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
  <h2 className="text-white">Заголовок</h2>
  <p className="text-white">Текст</p>
</section>
```

✅ **Хорошо:**
```tsx
<section className="py-16 section-gradient">
  <h2>Заголовок</h2>
  <p>Текст</p>
</section>
```

### 3. Используйте утилитарные классы для типографики

❌ **Плохо:**
```tsx
<p className="text-muted-foreground">Описание</p>
<p className="text-sm text-muted-foreground">Маленький текст</p>
```

✅ **Хорошо:**
```tsx
<p className="text-description">Описание</p>
<p className="text-small">Маленький текст</p>
```

### 4. Используйте Badge компонент для меток

❌ **Плохо:**
```tsx
<span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
  Категория
</span>
```

✅ **Хорошо:**
```tsx
<CategoryBadge>Категория</CategoryBadge>
```

## 🚀 Преимущества

1. **Меньше кода** - один компонент вместо множества классов
2. **Надежнее** - стили применяются автоматически
3. **Легче поддерживать** - изменения в одном месте
4. **Нет конфликтов** - четкая иерархия стилей
5. **Быстрее разработка** - готовые компоненты

## 📝 Примеры использования

### Страница с градиентной секцией

```tsx
import { Section, SectionHeader, SectionContainer } from '@/components/ui/Section'
import { IconCard } from '@/components/ui/Card'
import { StatsGrid, Stat } from '@/components/ui/Stats'

export default function Page() {
  return (
    <main>
      {/* Hero секция */}
      <Section variant="muted">
        <SectionContainer size="lg">
          <SectionHeader 
            title="Заголовок страницы"
            subtitle="Описание страницы"
          />
        </SectionContainer>
      </Section>

      {/* Контент */}
      <Section variant="default">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <IconCard
              icon={<Icon className="w-8 h-8 text-primary" />}
              title="Преимущество 1"
              description="Описание"
              centered
            />
            {/* ... */}
          </div>
        </SectionContainer>
      </Section>

      {/* Статистика */}
      <Section variant="muted">
        <SectionContainer>
          <StatsGrid columns={4}>
            <Stat value="150+" label="Проектов" />
            <Stat value="120+" label="Клиентов" />
            <Stat value="10+" label="Лет" />
            <Stat value="500+" label="Млн ₽" />
          </StatsGrid>
        </SectionContainer>
      </Section>

      {/* CTA секция */}
      <Section variant="gradient">
        <SectionContainer>
          <SectionHeader 
            title="Готовы начать?"
            subtitle="Свяжитесь с нами сегодня"
          />
          <div className="flex justify-center gap-4">
            <Button>Связаться</Button>
          </div>
        </SectionContainer>
      </Section>
    </main>
  )
}
```
