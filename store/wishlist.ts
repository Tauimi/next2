import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  createdAt: string
  updatedAt: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    originalPrice?: number
    discount?: number
    inStock: boolean
    averageRating: number
    totalReviews: number
    images: Array<{
      id: string
      url: string
      alt: string
      isPrimary: boolean
    }>
    category: {
      name: string
      slug: string
    }
    brand?: {
      name: string
      slug: string
    }
  }
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  isOpen: boolean
  
  // Actions
  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  clearWishlist: () => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string) => Promise<boolean>
  
  // UI actions
  toggleWishlistDrawer: () => void
  setWishlistOpen: (open: boolean) => void
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      isOpen: false,

      fetchWishlist: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/wishlist', {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка загрузки избранного')
          }

          set({ 
            items: data.data || [],
            isLoading: false,
            error: null
          })
        } catch (error) {
          console.error('Fetch wishlist error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка загрузки избранного',
            isLoading: false
          })
        }
      },

      addToWishlist: async (productId: string) => {
        const { items } = get()
        
        // Проверяем, нет ли товара уже в избранном
        if (items.some(item => item.productId === productId)) {
          set({ error: 'Товар уже в избранном' })
          return false
        }

        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ productId })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка добавления в избранное')
          }

          // Добавляем товар в локальное состояние
          set(state => ({
            items: [data.data, ...state.items],
            isLoading: false,
            error: null
          }))

          return true
        } catch (error) {
          console.error('Add to wishlist error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка добавления в избранное',
            isLoading: false
          })
          return false
        }
      },

      removeFromWishlist: async (productId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch(`/api/wishlist?productId=${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка удаления из избранного')
          }

          // Удаляем товар из локального состояния
          set(state => ({
            items: state.items.filter(item => item.productId !== productId),
            isLoading: false,
            error: null
          }))

          return true
        } catch (error) {
          console.error('Remove from wishlist error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка удаления из избранного',
            isLoading: false
          })
          return false
        }
      },

      clearWishlist: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/wishlist?clearAll=true', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка очистки избранного')
          }

          set({ 
            items: [],
            isLoading: false,
            error: null
          })

          return true
        } catch (error) {
          console.error('Clear wishlist error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка очистки избранного',
            isLoading: false
          })
          return false
        }
      },

      isInWishlist: (productId: string) => {
        const { items } = get()
        return items.some(item => item.productId === productId)
      },

      toggleWishlist: async (productId: string) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get()
        
        if (isInWishlist(productId)) {
          return await removeFromWishlist(productId)
        } else {
          return await addToWishlist(productId)
        }
      },

      // UI actions
      toggleWishlistDrawer: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      setWishlistOpen: (open: boolean) => {
        set({ isOpen: open })
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ 
        items: state.items 
      }),
    }
  )
)

export default useWishlistStore 