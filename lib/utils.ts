import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugify from 'slugify'
import { Product, ProductCardData } from '@/types'

// Объединение CSS классов
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Создание slug из строки
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-я]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Форматирование цены
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Форматирование числа
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num)
}

// Форматирование даты
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

// Форматирование даты и времени
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Обрезка текста
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Валидация email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Валидация телефона
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+7|8|7)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Генерация случайного ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Задержка (для демонстрации загрузки)
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Безопасное парсинг JSON
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

// Получение инициалов
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0).toUpperCase() || ''
  const last = lastName?.charAt(0).toUpperCase() || ''
  return first + last || '??'
}

// Проверка на мобильное устройство
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Скроллинг к элементу
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// Копирование текста в буфер обмена
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Дебаунс функции
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Ограничение частоты вызовов
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Адаптер для преобразования Product в ProductCardData
export function adaptProductToCard(product: any): ProductCardData {
  return {
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    inStock: product.inStock,
    isNew: product.isNew,
    isHot: product.isHot,
    averageRating: product.averageRating || 0,
    totalReviews: product._count?.reviews || product.totalReviews || 0,
    images: product.images?.map((img: any) => ({
      url: img.url,
      alt: img.alt || img.altText || product.name
    })) || [],
    category: product.category ? {
      name: product.category.name
    } : undefined,
    brand: product.brand ? {
      name: product.brand.name
    } : undefined
  }
}

// Получение товаров с правильной типизацией
export async function fetchProducts(params: any = {}): Promise<ProductCardData[]> {
  try {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await fetch(`/api/products?${searchParams}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    
    const result = await response.json()
    
    if (result.success && result.data) {
      return result.data.map(adaptProductToCard)
    }
    
    return []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
} 