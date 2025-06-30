import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Tag, Eye, ArrowRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Новости TechnoMart - Акции, обзоры техники, технологические новинки',
  description: 'Последние новости TechnoMart: акции, обзоры новых товаров, технологические тренды и полезные советы.',
  openGraph: {
    title: 'Новости TechnoMart',
    description: 'Последние новости и акции от TechnoMart',
  },
}

const newsCategories = [
  { id: 'all', name: 'Все новости', count: 45 },
  { id: 'promotions', name: 'Акции', count: 12 },
  { id: 'reviews', name: 'Обзоры', count: 15 },
  { id: 'tech-news', name: 'Новинки техники', count: 18 },
]

const featuredNews = [
  {
    id: '1',
    title: 'Грандиозная распродажа смартфонов - скидки до 40%',
    slug: 'smartphone-sale-40-percent',
    excerpt: 'Не упустите шанс приобрести новый смартфон с максимальной выгодой. В распродаже участвуют более 100 моделей от ведущих производителей.',
    content: 'Полный текст новости...',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop&crop=center',
    category: 'promotions',
    categoryName: 'Акции',
    author: 'Анна Петрова',
    publishedAt: '2024-01-15T10:00:00Z',
    views: 2341,
    featured: true,
    tags: ['акции', 'смартфоны', 'скидки']
  },
  {
    id: '2',
    title: 'Обзор новых ноутбуков Apple MacBook Pro M3',
    slug: 'macbook-pro-m3-review',
    excerpt: 'Подробный обзор новых ноутбуков Apple с процессором M3. Тестирование производительности, автономности и сравнение с предыдущими моделями.',
    content: 'Полный текст новости...',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop&crop=center',
    category: 'reviews',
    categoryName: 'Обзоры',
    author: 'Дмитрий Козлов',
    publishedAt: '2024-01-12T14:30:00Z',
    views: 1876,
    featured: true,
    tags: ['обзоры', 'ноутбуки', 'apple']
  },
  {
    id: '3',
    title: 'Новинки CES 2024: что ждать от выставки техники',
    slug: 'ces-2024-tech-highlights',
    excerpt: 'Самые интересные анонсы с крупнейшей выставки потребительской электроники CES 2024. Новые категории устройств и технологические тренды.',
    content: 'Полный текст новости...',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center',
    category: 'tech-news',
    categoryName: 'Новинки техники',
    author: 'Елена Сидорова',
    publishedAt: '2024-01-10T16:45:00Z',
    views: 3102,
    featured: true,
    tags: ['выставки', 'новинки', 'технологии']
  }
]

const regularNews = [
  {
    id: '4',
    title: 'Как выбрать игровую клавиатуру: гид по покупке',
    slug: 'gaming-keyboard-buying-guide',
    excerpt: 'Механические переключатели, подсветка, программируемые клавиши - разбираемся в особенностях игровых клавиатур.',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop&crop=center',
    category: 'reviews',
    categoryName: 'Обзоры',
    author: 'Андрей Морозов',
    publishedAt: '2024-01-08T11:15:00Z',
    views: 1245,
    tags: ['клавиатуры', 'игры', 'гайды']
  },
  {
    id: '5',
    title: 'Скидка 25% на всю бытовую технику Samsung',
    slug: 'samsung-appliances-25-off',
    excerpt: 'Только до конца месяца - специальная скидка на холодильники, стиральные машины и другую технику Samsung.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
    category: 'promotions',
    categoryName: 'Акции',
    author: 'Мария Иванова',
    publishedAt: '2024-01-06T09:30:00Z',
    views: 987,
    tags: ['акции', 'samsung', 'бытовая техника']
  },
  {
    id: '6',
    title: 'Лучшие смарт-часы 2024 года: топ-10 моделей',
    slug: 'best-smartwatches-2024',
    excerpt: 'Рейтинг лучших умных часов года с подробным сравнением характеристик, цен и функциональности.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&crop=center',
    category: 'reviews',
    categoryName: 'Обзоры',
    author: 'Ольга Петрова',
    publishedAt: '2024-01-04T13:20:00Z',
    views: 2156,
    tags: ['smartwatch', 'рейтинги', 'обзоры']
  },
  {
    id: '7',
    title: 'Новые процессоры Intel Core 14-го поколения',
    slug: 'intel-core-14th-gen-processors',
    excerpt: 'Intel представила новую линейку процессоров с улучшенной энергоэффективностью и производительностью.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop&crop=center',
    category: 'tech-news',
    categoryName: 'Новинки техники',
    author: 'Сергей Волков',
    publishedAt: '2024-01-02T15:45:00Z',
    views: 1789,
    tags: ['процессоры', 'intel', 'новинки']
  },
  {
    id: '8',
    title: 'Итоги года: самые популярные товары TechnoMart',
    slug: 'technomart-2023-bestsellers',
    excerpt: 'Подводим итоги года - какие товары чаще всего покупали наши клиенты и что было в тренде.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
    category: 'promotions',
    categoryName: 'Акции',
    author: 'Екатерина Смирнова',
    publishedAt: '2023-12-30T12:00:00Z',
    views: 3456,
    tags: ['итоги года', 'статистика', 'популярные товары']
  },
  {
    id: '9',
    title: 'Обзор беспроводных наушников Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5-review',
    excerpt: 'Тестируем флагманские беспроводные наушники Sony с активным шумоподавлением.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop&crop=center',
    category: 'reviews',
    categoryName: 'Обзоры',
    author: 'Николай Кузнецов',
    publishedAt: '2023-12-28T14:15:00Z',
    views: 1543,
    tags: ['наушники', 'sony', 'обзоры']
  }
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Новости <span className="text-primary">TechnoMart</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Будьте в курсе последних акций, обзоров новинок и технологических трендов
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {newsCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={category.id === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Главные новости</h2>
            <p className="text-xl text-muted-foreground">
              Самые важные и интересные материалы
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Featured Article */}
            <div className="lg:col-span-2">
              <Link href={`/news/${featuredNews[0].slug}`}>
                <article className="group cursor-pointer">
                  <div className="relative h-96 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={featuredNews[0].image}
                      alt={featuredNews[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                        {featuredNews[0].categoryName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {featuredNews[0].title}
                    </h2>
                    <p className="text-muted-foreground">
                      {featuredNews[0].excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredNews[0].author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredNews[0].publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {featuredNews[0].views.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {featuredNews[0].tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-muted text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Side Featured Articles */}
            <div className="space-y-6">
              {featuredNews.slice(1).map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <article className="group cursor-pointer border-b pb-6 last:border-b-0">
                    <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                          {article.categoryName}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(article.publishedAt)}</span>
                      <span>{article.views} просмотров</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regular News Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Все новости</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularNews.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="relative h-48">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                        {article.categoryName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{article.author}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {article.views}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button variant="outline">Предыдущая</Button>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="default">1</Button>
              <Button size="sm" variant="outline">2</Button>
              <Button size="sm" variant="outline">3</Button>
              <span className="px-2">...</span>
              <Button size="sm" variant="outline">10</Button>
            </div>
            <Button variant="outline">Следующая</Button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Подпишитесь на новости
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Будьте первыми в курсе новых акций, обзоров и технологических новинок
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input 
                type="email" 
                placeholder="Ваш email"
                className="flex-1 px-4 py-3 rounded-lg text-secondary-900"
              />
              <Button variant="secondary" size="lg">
                Подписаться
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 