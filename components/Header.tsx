'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Phone,
  Heart,
  GitCompare,
  LogOut,
  Settings,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import useWishlistStore from '@/store/wishlist'
import useCompareStore from '@/store/compare'

const navigation = [
  { name: 'Каталог', href: '/catalog' },
  { name: 'Услуги', href: '/services' },
  { name: 'Проекты', href: '/projects' },
  { name: 'Клиенты', href: '/clients' },
  { name: 'Новости', href: '/news' },
  { name: 'Справка', href: '/help' },
]

export default function Header() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  
  const { totalItems, fetchCart } = useCartStore()
  const { user, logout } = useAuthStore()
  const { items: wishlistItems, fetchWishlist } = useWishlistStore()
  const { items: compareItems, fetchCompare } = useCompareStore()

  // Закрытие мобильного меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Загрузка корзины, wishlist и compare при авторизации
  useEffect(() => {
    if (user) {
      fetchCart()
      fetchWishlist()
      fetchCompare()
    }
  }, [user, fetchCart, fetchWishlist, fetchCompare])

  // Загрузка корзины при первой загрузке
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden lg:flex items-center justify-between py-2 text-sm border-b">
          <div className="flex items-center gap-6 text-secondary-500">
            <span>Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</span>
            <Link href="/delivery" className="hover:text-primary-600 transition-colors">
              Бесплатная доставка от 5000₽
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/accessibility" className="text-secondary-500 hover:text-primary-600 transition-colors text-sm">
              Версия для слабовидящих
            </Link>
            <span className="text-secondary-500">|</span>
            <Link href="/about" className="text-secondary-500 hover:text-primary-600 transition-colors text-sm">
              О компании
            </Link>
            <span className="text-secondary-500">|</span>
            <Link href="/contacts" className="text-secondary-500 hover:text-primary-600 transition-colors text-sm">
              Контакты
            </Link>
            {user?.isAdmin && (
              <>
            <span className="text-secondary-500">|</span>
            <Link href="/admin" className="text-secondary-500 hover:text-primary-600 transition-colors text-sm">
              Админ-панель
            </Link>
              </>
            )}
            <Link 
              href="tel:+78001234567" 
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +7 (800) 123-45-67
            </Link>
            <Button 
              size="sm" 
              variant="outline"
              asChild
            >
              <Link href="/services">
                Заказать услугу
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-primary-600">TechnoMart</h1>
              <p className="text-xs text-secondary-500">Электроника и техника</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-secondary-900 hover:text-primary-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden"
              >
                <Search className="w-5 h-5" />
              </Button>
              
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden lg:flex">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pr-10"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Wishlist */}
            {user && (
              <Button size="icon" variant="ghost" className="relative" asChild>
                <Link href="/wishlist">
                  <>
                    <Heart className="w-5 h-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                      </span>
                    )}
                  </>
                </Link>
              </Button>
            )}

            {/* Compare */}
            {user && (
              <Button size="icon" variant="ghost" className="relative" asChild>
                <Link href="/compare">
                  <>
                    <GitCompare className="w-5 h-5" />
                    {compareItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {compareItems.length}
                      </span>
                    )}
                  </>
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Button size="icon" variant="ghost" className="relative" asChild>
              <Link href="/cart">
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </>
              </Link>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="w-5 h-5" />
              </Button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b">
                          <p className="font-medium">{user.firstName || user.username}</p>
                          <p className="text-sm text-secondary-500">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Профиль
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          Заказы
                        </Link>
                        {user.isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-100 transition-colors border-t"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Админ-панель
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-100 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Выйти
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 hover:bg-secondary-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Войти
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-2 hover:bg-secondary-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Регистрация
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t py-4"
            >
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <nav className="container mx-auto px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-secondary-900 hover:text-primary-600 transition-colors border-b last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Contact */}
              <div className="pt-4 mt-4 border-t">
                <Link 
                  href="tel:+78001234567" 
                  className="flex items-center gap-3 py-2 text-primary-600"
                >
                  <Phone className="w-5 h-5" />
                  +7 (800) 123-45-67
                </Link>
                <Button 
                  className="w-full mt-3" 
                  variant="outline"
                  asChild
                >
                  <Link 
                    href="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    Заказать услугу
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>


    </header>
  )
} 