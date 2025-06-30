'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const quickLinks = [
  { name: 'О компании', href: '/about' },
  { name: 'Доставка и оплата', href: '/delivery' },
  { name: 'Гарантия', href: '/warranty' },
  { name: 'Возврат товара', href: '/returns' },
  { name: 'Политика конфиденциальности', href: '/privacy' },
]

const categories = [
  { name: 'Смартфоны', href: '/catalog/smartphones' },
  { name: 'Ноутбуки', href: '/catalog/laptops' },
  { name: 'Телевизоры', href: '/catalog/tvs' },
  { name: 'Планшеты', href: '/catalog/tablets' },
  { name: 'Аксессуары', href: '/catalog/accessories' },
]

const helpLinks = [
  { name: 'FAQ', href: '/help/faq' },
  { name: 'Техническая поддержка', href: '/help/support' },
  { name: 'Инструкции', href: '/help/instructions' },
  { name: 'Сравнение товаров', href: '/compare' },
  { name: 'Отзывы', href: '/reviews' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary">TechnoMart</h3>
                <p className="text-sm text-muted-foreground">Электроника и техника</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Ваш надежный партнер в мире современных технологий. 
              Качественная техника, выгодные цены, профессиональный сервис.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <Link href="tel:+78001234567" className="hover:text-primary transition-colors">
                  +7 (800) 123-45-67
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <Link href="mailto:info@technomart.ru" className="hover:text-primary transition-colors">
                  info@technomart.ru
                </Link>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span className="text-muted-foreground">
                  г. Москва, ул. Технологическая, д. 15
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  Пн-Пт: 9:00-18:00, Сб: 10:00-16:00
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="font-semibold mb-4">Помощь</h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 TechnoMart. Все права защищены.
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/sitemap"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Карта сайта
            </Link>
            <Link
              href="/accessibility"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Версия для слабовидящих
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        size="icon"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 shadow-lg"
        aria-label="Наверх"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </footer>
  )
} 