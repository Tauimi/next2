import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Home, ShoppingBag, Info, Briefcase, Users, 
  Phone, HelpCircle, Newspaper, Truck, Shield, 
  FileText, RotateCcw, User, ShoppingCart, Heart,
  Search, Grid3X3, Tags
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Карта сайта - TechnoMart',
  description: 'Карта сайта TechnoMart. Все страницы и разделы интернет-магазина техники и электроники.',
}

const siteStructure = [
  {
    title: 'Главная',
    icon: Home,
    links: [
      { title: 'Главная страница', href: '/', description: 'Добро пожаловать в TechnoMart' }
    ]
  },
  {
    title: 'Каталог',
    icon: ShoppingBag,
    links: [
      { title: 'Каталог товаров', href: '/catalog', description: 'Все категории товаров' },
      { title: 'Поиск', href: '/search', description: 'Поиск по товарам' },
      { title: 'Категории', href: '/categories', description: 'Категории товаров' },
    ]
  },
  {
    title: 'Покупки',
    icon: ShoppingCart,
    links: [
      { title: 'Корзина', href: '/cart', description: 'Ваши товары к покупке' },
      { title: 'Избранное', href: '/wishlist', description: 'Сохраненные товары' },
      { title: 'Заказы', href: '/orders', description: 'История ваших заказов' }
    ]
  },
  {
    title: 'Личный кабинет',
    icon: User,
    links: [
      { title: 'Профиль', href: '/profile', description: 'Личная информация' },
      { title: 'Вход', href: '/auth/login', description: 'Авторизация' },
      { title: 'Регистрация', href: '/auth/register', description: 'Создание аккаунта' },
      { title: 'Восстановление пароля', href: '/auth/forgot-password', description: 'Сброс пароля' }
    ]
  },
  {
    title: 'Компания',
    icon: Info,
    links: [
      { title: 'О компании', href: '/about', description: 'История, команда, миссия' },
      { title: 'Проекты', href: '/projects', description: 'Наши работы и достижения' },
      { title: 'Клиенты', href: '/clients', description: 'Отзывы и партнеры' },
      { title: 'Контакты', href: '/contacts', description: 'Связь с нами' }
    ]
  },
  {
    title: 'Поддержка',
    icon: HelpCircle,
    links: [
      { title: 'Помощь', href: '/help', description: 'Центр помощи' },
      { title: 'FAQ', href: '/faq', description: 'Часто задаваемые вопросы' },
      { title: 'Новости', href: '/news', description: 'Новости компании' }
    ]
  },
  {
    title: 'Услуги',
    icon: Truck,
    links: [
      { title: 'Доставка и оплата', href: '/delivery', description: 'Условия доставки' },
      { title: 'Гарантия', href: '/warranty', description: 'Гарантийное обслуживание' },
      { title: 'Возврат товаров', href: '/returns', description: 'Условия возврата' }
    ]
  },
  {
    title: 'Документы',
    icon: FileText,
    links: [
      { title: 'Политика конфиденциальности', href: '/privacy', description: 'Обработка персональных данных' },
      { title: 'Пользовательское соглашение', href: '/terms', description: 'Условия использования' },
      { title: 'Карта сайта', href: '/sitemap', description: 'Структура сайта' }
    ]
  }
]

const popularPages = [
  { title: 'Смартфоны', href: '/catalog?category=smartphones', views: '15.2k' },
  { title: 'Ноутбуки', href: '/catalog?category=laptops', views: '12.8k' },
  { title: 'Телевизоры', href: '/catalog?category=tv', views: '9.4k' },
  { title: 'Наушники', href: '/catalog?category=headphones', views: '8.1k' },
  { title: 'Планшеты', href: '/catalog?category=tablets', views: '6.7k' },
  { title: 'Аксессуары', href: '/catalog?category=accessories', views: '5.3k' }
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Карта <span className="text-primary">сайта</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Навигация по всем разделам и страницам TechnoMart
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Всего страниц', value: '25+', icon: Grid3X3 },
              { label: 'Категорий товаров', value: '12+', icon: Tags },
              { label: 'Разделов помощи', value: '8', icon: HelpCircle },
              { label: 'Документов', value: '6', icon: FileText }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Sitemap */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Структура сайта</h2>
              <p className="text-xl text-muted-foreground">
                Все разделы и страницы нашего интернет-магазина
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteStructure.map((section, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        className="block p-3 bg-white rounded-lg hover:bg-primary/5 transition-colors group"
                      >
                        <div className="font-medium text-primary group-hover:text-primary/80 mb-1">
                          {link.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {link.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Pages */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Популярные разделы</h2>
              <p className="text-xl text-muted-foreground">
                Самые посещаемые страницы нашего каталога
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPages.map((page, index) => (
                <Link
                  key={index}
                  href={page.href}
                  className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {page.views} просмотров
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Site Search */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Не нашли нужную страницу?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Воспользуйтесь поиском или свяжитесь с нами
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/search"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Search className="mr-2 w-5 h-5" />
                Поиск по сайту
              </Link>
              <Link 
                href="/contacts"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Phone className="mr-2 w-5 h-5" />
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* XML Sitemap */}
      <section className="py-12 bg-muted/50 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">XML карта сайта</h3>
            <p className="text-muted-foreground mb-4">
              Для поисковых систем доступна XML-версия карты сайта
            </p>
            <Link 
              href="/sitemap.xml"
              className="text-primary hover:text-primary/80 transition-colors text-sm"
            >
              sitemap.xml
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
} 