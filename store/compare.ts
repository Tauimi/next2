import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompareItem {
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
    specifications: Array<{
      id: string
      name: string
      value: string
      unit?: string
      groupName?: string
      sortOrder: number
    }>
  }
}

export interface GroupedSpec {
  name: string
  unit?: string
  values: Record<string, string>
}

interface CompareState {
  items: CompareItem[]
  groupedSpecs: Record<string, GroupedSpec[]>
  isLoading: boolean
  error: string | null
  isOpen: boolean
  
  // Actions
  fetchCompare: () => Promise<void>
  addToCompare: (productId: string) => Promise<boolean>
  removeFromCompare: (productId: string) => Promise<boolean>
  clearCompare: () => Promise<boolean>
  isInCompare: (productId: string) => boolean
  toggleCompare: (productId: string) => Promise<boolean>
  
  // UI actions
  toggleCompareDrawer: () => void
  setCompareOpen: (open: boolean) => void
}

const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      groupedSpecs: {},
      isLoading: false,
      error: null,
      isOpen: false,

      fetchCompare: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/compare', {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка загрузки сравнения')
          }

          set({ 
            items: data.data.items || [],
            groupedSpecs: data.data.groupedSpecs || {},
            isLoading: false,
            error: null
          })
        } catch (error) {
          console.error('Fetch compare error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка загрузки сравнения',
            isLoading: false
          })
        }
      },

      addToCompare: async (productId: string) => {
        const { items } = get()
        
        // Проверяем, нет ли товара уже в сравнении
        if (items.some(item => item.productId === productId)) {
          set({ error: 'Товар уже в сравнении' })
          return false
        }

        // Проверяем лимит товаров
        if (items.length >= 4) {
          set({ error: 'Максимум 4 товара для сравнения' })
          return false
        }

        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/compare', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ productId })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка добавления в сравнение')
          }

          // Обновляем список сравнения
          await get().fetchCompare()
          return true
        } catch (error) {
          console.error('Add to compare error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка добавления в сравнение',
            isLoading: false
          })
          return false
        }
      },

      removeFromCompare: async (productId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch(`/api/compare?productId=${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка удаления из сравнения')
          }

          // Удаляем товар из локального состояния
          set(state => ({
            items: state.items.filter(item => item.productId !== productId),
            isLoading: false,
            error: null
          }))

          // Обновляем группированные характеристики
          await get().fetchCompare()
          return true
        } catch (error) {
          console.error('Remove from compare error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка удаления из сравнения',
            isLoading: false
          })
          return false
        }
      },

      clearCompare: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/compare?clearAll=true', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Ошибка очистки сравнения')
          }

          set({ 
            items: [],
            groupedSpecs: {},
            isLoading: false,
            error: null
          })

          return true
        } catch (error) {
          console.error('Clear compare error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка очистки сравнения',
            isLoading: false
          })
          return false
        }
      },

      isInCompare: (productId: string) => {
        const { items } = get()
        return items.some(item => item.productId === productId)
      },

      toggleCompare: async (productId: string) => {
        const { isInCompare, addToCompare, removeFromCompare } = get()
        
        if (isInCompare(productId)) {
          return await removeFromCompare(productId)
        } else {
          return await addToCompare(productId)
        }
      },

      // UI actions
      toggleCompareDrawer: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      setCompareOpen: (open: boolean) => {
        set({ isOpen: open })
      }
    }),
    {
      name: 'compare-storage',
      partialize: (state) => ({ 
        items: state.items,
        groupedSpecs: state.groupedSpecs
      }),
    }
  )
)

export default useCompareStore 