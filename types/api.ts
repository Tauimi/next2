// API Response Types

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Product API Types
export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isFeatured?: boolean
  isNew?: boolean
  sortBy?: 'price' | 'name' | 'createdAt' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductCreateInput {
  name: string
  description: string
  shortDescription?: string
  price: number
  originalPrice?: number
  categoryId: string
  brandId?: string
  stockQuantity: number
  inStock: boolean
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  id: string
}

// Category API Types
export interface CategoryListParams {
  page?: number
  limit?: number
  search?: string
  parentId?: string | null
  isActive?: boolean
}

export interface CategoryCreateInput {
  name: string
  description?: string
  parentId?: string | null
  sortOrder?: number
  isActive?: boolean
  image?: string
}

export interface CategoryUpdateInput extends Partial<CategoryCreateInput> {
  id: string
}

// Order API Types
export interface OrderListParams {
  page?: number
  limit?: number
  status?: string
  paymentStatus?: string
  userId?: string
  search?: string
}

export interface ShippingAddress {
  street: string
  city: string
  zipCode: string
  country?: string
}

export interface OrderCreateInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  notes?: string
  paymentMethod: string
  shippingMethod: string
}

export interface OrderUpdateInput {
  status?: string
  paymentStatus?: string
  trackingNumber?: string
  notes?: string
}

// Cart API Types
export interface CartItemInput {
  productId: string
  quantity: number
}

// Wishlist API Types
export interface WishlistItemInput {
  productId: string
}

// Compare API Types
export interface CompareItemInput {
  productId: string
}

// User API Types
export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  isAdmin?: boolean
  isActive?: boolean
}

export interface UserUpdateInput {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  isActive?: boolean
  isAdmin?: boolean
}

// Auth API Types
export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  user: {
    id: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    isAdmin: boolean
  }
  token: string
}

// Profile API Types
export interface ProfileUpdateInput {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
}

// Review API Types
export interface ReviewCreateInput {
  productId: string
  rating: number
  title?: string
  content: string
  pros?: string
  cons?: string
}

// Stats API Types
export interface AdminStats {
  products: {
    total: number
    active: number
    outOfStock: number
  }
  categories: {
    total: number
    active: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    totalRevenue: number
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    customerName: string
    totalAmount: number
    status: string
    createdAt: string
  }>
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  monthlyStats: Array<{
    month: string
    orders: number
    revenue: number
  }>
}
