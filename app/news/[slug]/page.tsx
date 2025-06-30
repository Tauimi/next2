import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Eye, Share2, ArrowLeft, Tag, ThumbsUp, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type Props = {
  params: { slug: string }
}

// Mock данные для новости (в реальном проекте будет из API)
const getNewsArticle = (slug: string) => {
  const articles = {
    'smartphone-sale-40-percent': {
      id: '1',
      title: 'Грандиозная распродажа смартфонов - скидки до 40%',
      excerpt: 'Не упустите шанс приобрести новый смартфон с максимальной выгодой. В распродаже участвуют более 100 моделей от ведущих производителей.',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop&crop=center',
      category: 'promotions',
      categoryName: 'Акции',
      author: 'Анна Петрова',
      publishedAt: '2024-01-15T10:00:00Z',
      views: 2341,
      likes: 156,
      comments: 23,
      tags: ['акции', 'смартфоны', 'скидки'],
      content: `
        <p>TechnoMart объявляет о старте грандиозной распродажи смартфонов с невероятными скидками до 40%! Это уникальная возможность приобрести флагманские модели от ведущих производителей по беспрецедентно низким ценам.</p>

        <h2>Что участвует в распродаже</h2>
        <p>В акции принимают участие более 100 моделей смартфонов от таких брендов как:</p>
        <ul>
          <li><strong>Apple iPhone</strong> - скидки до 25% на все модели</li>
          <li><strong>Samsung Galaxy</strong> - скидки до 40% на флагманские серии</li>
          <li><strong>Xiaomi</strong> - скидки до 35% на популярные модели</li>
          <li><strong>Huawei</strong> - скидки до 30% на всю линейку</li>
          <li><strong>OnePlus</strong> - скидки до 25% на премиум-модели</li>
        </ul>

        <h2>Топ предложения</h2>
        <p>Среди самых выгодных предложений:</p>
        <ul>
          <li>iPhone 15 Pro Max 256GB - <span style="text-decoration: line-through;">149,990₽</span> <strong>112,490₽</strong></li>
          <li>Samsung Galaxy S24 Ultra 512GB - <span style="text-decoration: line-through;">129,990₽</span> <strong>89,990₽</strong></li>
          <li>Xiaomi 14 Pro 512GB - <span style="text-decoration: line-through;">79,990₽</span> <strong>55,990₽</strong></li>
        </ul>

        <h2>Условия акции</h2>
        <p>Распродажа действует с 15 по 31 января 2024 года. Количество товаров по акционным ценам ограничено. Действует правило "первый пришел - первый получил".</p>

        <p>Дополнительные преимущества:</p>
        <ul>
          <li>Бесплатная доставка по всей России</li>
          <li>Гарантия 2 года на все смартфоны</li>
          <li>Возможность оформления рассрочки 0-0-12</li>
          <li>Trade-in - сдай старый смартфон и получи дополнительную скидку</li>
        </ul>

        <h2>Как участвовать</h2>
        <p>Чтобы воспользоваться предложением:</p>
        <ol>
          <li>Перейдите в раздел "Акции" на нашем сайте</li>
          <li>Выберите понравившуюся модель</li>
          <li>Добавьте товар в корзину</li>
          <li>Оформите заказ удобным способом</li>
        </ol>

        <p>Торопитесь! Количество товаров ограничено, а такие цены больше не повторятся!</p>
      `
    },
    'macbook-pro-m3-review': {
      id: '2',
      title: 'Обзор новых ноутбуков Apple MacBook Pro M3',
      excerpt: 'Подробный обзор новых ноутбуков Apple с процессором M3. Тестирование производительности, автономности и сравнение с предыдущими моделями.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center',
      category: 'reviews',
      categoryName: 'Обзоры',
      author: 'Дмитрий Козлов',
      publishedAt: '2024-01-12T14:30:00Z',
      views: 1876,
      likes: 89,
      comments: 45,
      tags: ['обзоры', 'ноутбуки', 'apple'],
      content: `
        <p>Apple представила новую линейку MacBook Pro с революционным процессором M3. Мы протестировали новинку и готовы поделиться впечатлениями.</p>

        <h2>Технические характеристики</h2>
        <p>MacBook Pro M3 доступен в конфигурациях 14" и 16" с различными объемами памяти:</p>
        <ul>
          <li>Процессор: Apple M3, M3 Pro или M3 Max</li>
          <li>Память: от 8GB до 128GB унифицированной памяти</li>
          <li>Накопитель: от 512GB до 8TB SSD</li>
          <li>Дисплей: Liquid Retina XDR с ProMotion</li>
        </ul>

        <h2>Производительность</h2>
        <p>В наших тестах M3 показал впечатляющие результаты:</p>
        <ul>
          <li>На 20% быстрее M2 в однопоточных задачах</li>
          <li>На 15% выше производительность в многопоточности</li>
          <li>GPU на 65% мощнее предыдущего поколения</li>
        </ul>

        <h2>Автономность</h2>
        <p>Время работы от батареи составляет до 22 часов просмотра видео, что на 2 часа больше чем у M2.</p>

        <h2>Заключение</h2>
        <p>MacBook Pro M3 - достойное обновление с заметным приростом производительности и автономности.</p>
      `
    }
  }
  
  return articles[slug as keyof typeof articles] || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getNewsArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Новость не найдена - TechnoMart'
    }
  }

  return {
    title: `${article.title} - TechnoMart`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const relatedArticles = [
  {
    title: 'Скидка 25% на всю бытовую технику Samsung',
    slug: 'samsung-appliances-25-off',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center',
    category: 'Акции'
  },
  {
    title: 'Лучшие смарт-часы 2024 года: топ-10 моделей',
    slug: 'best-smartwatches-2024',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop&crop=center',
    category: 'Обзоры'
  },
  {
    title: 'Новые процессоры Intel Core 14-го поколения',
    slug: 'intel-core-14th-gen-processors',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&h=200&fit=crop&crop=center',
    category: 'Новинки техники'
  }
]

export default function NewsArticlePage({ params }: Props) {
  const article = getNewsArticle(params.slug)

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Новость не найдена</h1>
          <p className="text-muted-foreground mb-8">Возможно, новость была удалена или перемещена</p>
          <Button asChild>
            <Link href="/news">
              <>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Вернуться к новостям
              </>
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Breadcrumbs */}
      <section className="py-4 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">Главная</Link>
            <span>/</span>
            <Link href="/news" className="text-muted-foreground hover:text-primary">Новости</Link>
            <span>/</span>
            <span className="text-primary">{article.categoryName}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="outline" size="sm" className="mb-6" asChild>
              <Link href="/news">
                <>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Назад к новостям
                </>
              </Link>
            </Button>

            <div className="mb-6">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                {article.categoryName}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} просмотров</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{article.likes} лайков</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{article.comments} комментариев</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Button size="sm" variant="outline">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Нравится ({article.likes})
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="border-t pt-8 mb-8">
              <h3 className="font-semibold mb-4">Теги:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                    <Tag className="w-3 h-3" />
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="border-t pt-8 mb-8">
              <h3 className="font-semibold mb-4">Поделиться:</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">VKontakte</Button>
                <Button variant="outline" size="sm">Telegram</Button>
                <Button variant="outline" size="sm">WhatsApp</Button>
                <Button variant="outline" size="sm">Twitter</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Похожие новости</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <Link key={index} href={`/news/${related.slug}`}>
                  <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                    <div className="relative h-40">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                          {related.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Не пропустите новые новости
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Подпишитесь на нашу рассылку и узнавайте о новых акциях первыми
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