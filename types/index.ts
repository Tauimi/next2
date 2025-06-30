// Базовые типы для TechnoMart

export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  isAdmin: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  products?: Product[]
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  isActive: boolean
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  originalPrice?: number
  discount?: number
  inStock: boolean
  stockQuantity: number
  minQuantity: number
  
  // Связи
  categoryId: string
  category: Category
  brandId?: string
  brand?: Brand
  
  // Медиа
  images: ProductImage[]
  videos?: ProductVideo[]
  
  // Характеристики
  specifications: ProductSpecification[]
  
  // SEO
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  
  // Статусы
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  isHot: boolean
  
  // Рейтинг и отзывы
  averageRating: number
  totalReviews: number
  reviews?: Review[]
  
  // Даты
  createdAt: Date
  updatedAt: Date
  
  // Связанные товары
  relatedProducts?: Product[]
  crossSellProducts?: Product[]
}

// Упрощенный тип для карточки товара
export interface ProductCardData {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number | null
  discount?: number
  inStock: boolean
  isNew?: boolean
  isHot?: boolean
  averageRating: number
  totalReviews: number
  images?: Array<{
    url: string
    alt: string
  }>
  category?: {
    name: string
  }
  brand?: {
    name: string
  }
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt: string
  sortOrder: number
  isPrimary: boolean
}

export interface ProductVideo {
  id: string
  productId: string
  url: string
  title: string
  thumbnail?: string
  sortOrder: number
}

export interface ProductSpecification {
  id: string
  productId: string
  name: string
  value: string
  unit?: string
  groupName?: string
  sortOrder: number
}

export interface Review {
  id: string
  productId: string
  product: Product
  userId?: string
  user?: User
  
  // Основная информация
  username: string
  email?: string
  rating: number
  title?: string
  content: string
  
  // Дополнительные поля
  pros?: string
  cons?: string
  images?: ReviewImage[]
  
  // Статусы
  isVerifiedPurchase: boolean
  isApproved: boolean
  isFeatured: boolean
  
  // Реакции
  helpfulCount: number
  notHelpfulCount: number
  
  // Ответ администратора
  adminResponse?: string
  adminResponseDate?: Date
  
  createdAt: Date
  updatedAt: Date
}

export interface ReviewImage {
  id: string
  reviewId: string
  url: string
  alt: string
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  totalPrice: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  user?: User
  
  // Контактная информация
  customerName: string
  customerEmail: string
  customerPhone: string
  
  // Адрес доставки
  shippingAddress: Address
  billingAddress?: Address
  
  // Товары
  items: OrderItem[]
  
  // Суммы
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  totalAmount: number
  
  // Статусы
  status: OrderStatus
  paymentStatus: PaymentStatus
  
  // Даты
  createdAt: Date
  updatedAt: Date
  shippedAt?: Date
  deliveredAt?: Date
  
  // Дополнительная информация
  notes?: string
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
  totalPrice: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

// Корпоративные страницы
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  authorId?: string
  author?: User
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  tags?: NewsTag[]
  views: number
}

export interface NewsTag {
  id: string
  name: string
  slug: string
  articles?: NewsArticle[]
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image?: string
  gallery?: ProjectImage[]
  clientName?: string
  completionDate?: Date
  status: 'perspective' | 'completed'
  category?: string
  technologies?: string[]
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProjectImage {
  id: string
  projectId: string
  url: string
  alt: string
  sortOrder: number
}

export interface Client {
  id: string
  name: string
  logo?: string
  website?: string
  description?: string
  isPartner: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  clientId?: string
  client?: Client
  clientName: string
  clientPosition?: string
  clientCompany?: string
  content: string
  rating?: number
  avatar?: string
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  sortOrder: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category?: string
  tags?: string[]
  authorId?: string
  author?: User
  isPublished: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  isRead: boolean
  isReplied: boolean
  createdAt: Date
  updatedAt: Date
}

// Фильтры и поиск
export interface ProductFilter {
  categories?: string[]
  brands?: string[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  rating?: number
  features?: Record<string, string[]>
}

export interface ProductSort {
  field: 'price' | 'name' | 'rating' | 'created' | 'popularity'
  direction: 'asc' | 'desc'
}

export interface SearchParams {
  query?: string
  filters?: ProductFilter
  sort?: ProductSort
  page?: number
  limit?: number
}

// API Response типы
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Состояние приложения
export interface AppState {
  user: User | null
  cart: Cart
  favorites: Product[]
  recentlyViewed: Product[]
  searchHistory: string[]
  accessibility: {
    isEnabled: boolean
    fontSize: 'normal' | 'large' | 'extra-large'
    contrast: 'normal' | 'high'
  }
}

// Компоненты UI
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: any
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: any
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Ошибки
export interface AppError {
  code: string
  message: string
  details?: any
} 