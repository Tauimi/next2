// Form Types

// Product Form
export interface ProductFormData {
  name: string
  description: string
  shortDescription: string
  price: string
  originalPrice: string
  categoryId: string
  brandId: string
  inStock: boolean
  stockQuantity: string
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  isHot?: boolean
}

// Category Form
export interface CategoryFormData {
  name: string
  description: string
  parentId: string
  sortOrder: string
  isActive: boolean
  image: string
}

// Order Form
export interface OrderFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    zipCode: string
    country?: string
  }
  billingAddress?: {
    street: string
    city: string
    zipCode: string
    country?: string
  }
  notes: string
  paymentMethod: string
  shippingMethod: string
}

// Contact Form
export interface ContactFormData {
  name: string
  phone: string
  email: string
  message: string
  privacy: boolean
}

// Service Form
export interface ServiceFormData {
  name: string
  phone: string
  email: string
  message: string
}

// Support Form
export interface SupportFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

// Auth Forms
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
}

// Profile Form
export interface ProfileFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
}

// Review Form
export interface ReviewFormData {
  rating: number
  title: string
  content: string
  pros: string
  cons: string
}

// Validation State
export interface ValidationState {
  [key: string]: boolean
}
