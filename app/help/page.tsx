import { Metadata } from 'next'
import Link from 'next/link'
import { Search, HelpCircle, Book, Phone, MessageCircle, ArrowRight, FileText, Truck, Shield, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const metadata: Metadata = {
  title: 'Справочная TechnoMart - FAQ, инструкции, помощь',
  description: 'Справочная информация TechnoMart: частые вопросы, инструкции по покупке, гарантии, доставке и возврату товаров.',
  openGraph: {
    title: 'Справочная TechnoMart',
    description: 'Ответы на частые вопросы и полезная информация',
  },
}

const helpCategories = [
  {
    icon: HelpCircle,
    title: 'Частые вопросы',
    description: 'Ответы на самые популярные вопросы',
    link: '/faq',
    articles: 25
  },
  {
    icon: Truck,
    title: 'Доставка и оплата',
    description: 'Способы доставки и оплаты заказов',
    link: '/delivery',
    articles: 8
  },
  {
    icon: Shield,
    title: 'Гарантии и возврат',
    description: 'Условия гарантии и возврата товаров',
    link: '/warranty',
    articles: 12
  },
  {
    icon: CreditCard,
    title: 'Оформление заказа',
    description: 'Как выбрать и заказать товар',
    link: '/how-to-order',
    articles: 6
  },
  {
    icon: FileText,
    title: 'Документы',
    description: 'Пользовательские соглашения и политики',
    link: '/documents',
    articles: 4
  },
  {
    icon: Phone,
    title: 'Техподдержка',
    description: 'Как связаться с поддержкой',
    link: '/contacts',
    articles: 3
  }
]

const popularFAQ = [
  {
    question: 'Как оформить заказ в интернет-магазине?',
    answer: 'Добавьте нужные товары в корзину, перейдите к оформлению заказа, заполните контактные данные и выберите способ доставки и оплаты.',
    category: 'Заказ'
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем банковские карты, электронные кошельки, наличные при получении, безналичный расчет для юридических лиц.',
    category: 'Оплата'
  },
  {
    question: 'Сколько стоит доставка?',
    answer: 'Доставка по Москве - от 300₽, по России - от 500₽. Бесплатная доставка при заказе от 10,000₽.',
    category: 'Доставка'
  },
  {
    question: 'Можно ли вернуть товар?',
    answer: 'Да, в течение 14 дней с момента получения без объяснения причин, если товар не был в употреблении.',
    category: 'Возврат'
  },
  {
    question: 'Какая гарантия на технику?',
    answer: 'Официальная гарантия производителя от 1 года. Срок зависит от конкретного товара и указан в описании.',
    category: 'Гарантия'
  },
  {
    question: 'Есть ли скидки для постоянных клиентов?',
    answer: 'Да, у нас действует программа лояльности с накопительными скидками до 10% и специальные предложения.',
    category: 'Скидки'
  },
  {
    question: 'Как отследить заказ?',
    answer: 'После отправки заказа вы получите SMS с трек-номером. Также можете отследить заказ в личном кабинете.',
    category: 'Доставка'
  },
  {
    question: 'Работаете ли с юридическими лицами?',
    answer: 'Да, у нас есть отдел корпоративных продаж. Работаем по договорам с отсрочкой платежа и особыми условиями.',
    category: 'Корпоративные продажи'
  }
]

const quickGuides = [
  {
    title: 'Как выбрать ноутбук',
    description: 'Подробное руководство по выбору ноутбука для работы, учебы и игр',
    readTime: '5 мин',
    views: '1.2k'
  },
  {
    title: 'Настройка смартфона',
    description: 'Первоначальная настройка нового смартфона пошагово',
    readTime: '3 мин',
    views: '890'
  },
  {
    title: 'Подключение TV приставки',
    description: 'Как подключить и настроить цифровую ТВ приставку',
    readTime: '4 мин',
    views: '756'
  },
  {
    title: 'Уход за техникой',
    description: 'Советы по продлению срока службы электроники',
    readTime: '6 мин',
    views: '643'
  }
]

export default function HelpPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Центр <span className="text-primary">помощи</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Найдите ответы на популярные вопросы, инструкции и полезные советы
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Поиск по базе знаний..." 
                className="pl-12 h-12 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Найти
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Разделы справки</h2>
            <p className="text-xl text-muted-foreground">
              Выберите нужную категорию для быстрого поиска информации
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Link key={index} href={category.link}>
                <div className="bg-muted/50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{category.articles} статей</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular FAQ */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Популярные вопросы</h2>
            <p className="text-xl text-muted-foreground">
              Самые частые вопросы наших клиентов
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {popularFAQ.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{faq.question}</h3>
                      <span className="px-2 py-1 bg-muted text-xs rounded-full">{faq.category}</span>
                    </div>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/faq">
                <>
                  Смотреть все вопросы
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Guides */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Полезные руководства</h2>
            <p className="text-xl text-muted-foreground">
              Пошаговые инструкции и советы экспертов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickGuides.map((guide, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="mb-4">
                  <Book className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground">{guide.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>📖 {guide.readTime}</span>
                  <span>👁️ {guide.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Не нашли ответ?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Наши специалисты готовы помочь вам с любыми вопросами
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Позвонить</h3>
                <p className="text-sm text-muted-foreground mb-4">Быстрая помощь по телефону</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+78001234567">+7 (800) 123-45-67</a>
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Онлайн-чат</h3>
                <p className="text-sm text-muted-foreground mb-4">Чат с оператором</p>
                <Button variant="outline" size="sm">
                  Начать чат
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Заявка</h3>
                <p className="text-sm text-muted-foreground mb-4">Форма обратной связи</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contacts">Написать</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Pages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Популярные страницы</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { title: 'Доставка и оплата', link: '/delivery' },
              { title: 'Гарантии', link: '/warranty' },
              { title: 'Возврат товара', link: '/returns' },
              { title: 'Политика конфиденциальности', link: '/privacy' },
              { title: 'Пользовательское соглашение', link: '/terms' },
              { title: 'Карта сайта', link: '/sitemap' },
              { title: 'О компании', link: '/about' },
              { title: 'Контакты', link: '/contacts' }
            ].map((page, index) => (
              <Link key={index} href={page.link}>
                <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <ArrowRight className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{page.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 