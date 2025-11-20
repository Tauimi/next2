// Database Types (расширение Prisma типов)

import { Prisma } from '@prisma/client'

// Product with relations
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true
    brand: true
    images: true
    specifications: true
    reviews: {
      include: {
        user: true
      }
    }
    _count: {
      select: {
        reviews: true
        cartItems: true
        wishlistItems: true
      }
    }
  }
}>

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true
    images: true
    _count: {
      select: { reviews: true }
    }
  }
}>

export type ProductBasic = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        id: true
        name: true
        slug: true
      }
    }
    images: {
      select: {
        id: true
        url: true
        alt: true
        isPrimary: true
      }
    }
  }
}>

// Category with relations
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parent: true
    children: true
    products: true
    _count: {
      select: {
        products: true
      }
    }
  }
}>

export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        images: true
      }
    }
  }
}>

// Order with relations
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true
    items: {
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    }
  }
}>

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true
      }
    }
  }
}>

// Cart with relations
export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        category: true
        images: true
      }
    }
  }
}>

// Wishlist with relations
export type WishlistItemWithProduct = Prisma.WishlistItemGetPayload<{
  include: {
    product: {
      include: {
        category: true
        images: true
      }
    }
  }
}>

// Compare with relations
export type CompareItemWithProduct = Prisma.CompareItemGetPayload<{
  include: {
    product: {
      include: {
        category: true
        images: true
        specifications: true
      }
    }
  }
}>

// Review with relations
export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        id: true
        username: true
        firstName: true
        lastName: true
      }
    }
    images: true
  }
}>

// User with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    orders: true
    reviews: true
    cartItems: true
    wishlistItems: true
  }
}>

// Specification grouped
export interface GroupedSpecification {
  groupName: string
  specifications: Array<{
    name: string
    value: string
    unit?: string
  }>
}

// Search filters
export interface ProductSearchFilters {
  search?: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isHot?: boolean
}

// Where clause builders
export type ProductWhereInput = Prisma.ProductWhereInput
export type CategoryWhereInput = Prisma.CategoryWhereInput
export type OrderWhereInput = Prisma.OrderWhereInput
export type UserWhereInput = Prisma.UserWhereInput
