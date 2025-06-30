import { Metadata } from 'next'
import { Star, ThumbsUp, MessageCircle, User, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const metadata: Metadata = {
  title: 'Отзывы покупателей - TechnoMart',
  description: 'Отзывы покупателей о товарах TechnoMart. Реальные мнения и оценки от наших клиентов.',
}

const reviews = [
  {
    id: 1,
    user: 'Алексей М.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    product: 'iPhone 15 Pro 128GB',
    rating: 5,
    date: '15.01.2024',
    helpful: 24,
    text: 'Отличный телефон! Камера действительно впечатляет, особенно ночные фото. Батарея держит весь день даже при активном использовании. Титановый корпус приятный на ощупь и не скользит в руках.',
    pros: ['Отличная камера', 'Долгая батарея', 'Премиальные материалы'],
    cons: ['Высокая цена', 'Нет зарядника в комплекте'],
    verified: true
  },
  {
    id: 2,
    user: 'Мария К.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e2e08b?w=100&h=100&fit=crop&crop=face',
    product: 'MacBook Air M2 256GB',
    rating: 5,
    date: '12.01.2024',
    helpful: 18,
    text: 'Идеальный ноутбук для работы и учебы. Очень тихий, почти не греется. Экран яркий и четкий. Клавиатура удобная. Единственный минус - маловато портов, но это решается хабом.',
    pros: ['Тихая работа', 'Отличный экран', 'Долгая автономность'],
    cons: ['Мало портов', 'Нет слота для SD карт'],
    verified: true
  },
  {
    id: 3,
    user: 'Дмитрий В.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    product: 'Samsung QLED QN90B 65"',
    rating: 4,
    date: '08.01.2024',
    helpful: 12,
    text: 'Телевизор хорош, но есть нюансы. Картинка действительно отличная, особенно в HDR контенте. Smart TV работает быстро. Но пульт мог бы быть удобнее, а настройка заняла довольно много времени.',
    pros: ['Отличное качество изображения', 'Быстрая Smart TV платформа', 'Стильный дизайн'],
    cons: ['Сложная настройка', 'Неудобный пульт'],
    verified: true
  },
  {
    id: 4,
    user: 'Анна С.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    product: 'AirPods Pro 2',
    rating: 5,
    date: '05.01.2024',
    helpful: 31,
    text: 'Лучшие наушники из тех, что у меня были! Шумоподавление работает просто волшебно - в метро можно спокойно слушать музыку на минимальной громкости. Звук очень чистый и детальный.',
    pros: ['Превосходное шумоподавление', 'Отличный звук', 'Удобная посадка'],
    cons: ['Дорогие', 'Быстро пачкается чехол'],
    verified: true
  },
  {
    id: 5,
    user: 'Игорь Р.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    product: 'Samsung Galaxy S24 Ultra',
    rating: 4,
    date: '02.01.2024',
    helpful: 9,
    text: 'Мощный флагман с отличными камерами. Особенно впечатлил зум - можно снимать луну! S Pen удобен для заметок. Батарея держит полтора дня. Единственное - греется при играх.',
    pros: ['Отличные камеры', 'S Pen в комплекте', 'Мощная производительность'],
    cons: ['Греется при нагрузке', 'Тяжелый'],
    verified: false
  }
]

const ratingStats = {
  average: 4.6,
  total: 1247,
  breakdown: [
    { stars: 5, count: 758, percentage: 61 },
    { stars: 4, count: 312, percentage: 25 },
    { stars: 3, count: 124, percentage: 10 },
    { stars: 2, count: 31, percentage: 2 },
    { stars: 1, count: 22, percentage: 2 }
  ]
}

export default function ReviewsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Отзывы <span className="text-primary">покупателей</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Реальные мнения и оценки от наших клиентов
            </p>
          </div>
        </div>
      </section>

      {/* Overall Rating */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="bg-muted/50 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {ratingStats.average}
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${
                        i < Math.floor(ratingStats.average) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  ))}
                </div>
                <div className="text-muted-foreground">
                  На основе {ratingStats.total.toLocaleString()} отзывов
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-6">Распределение оценок</h3>
                <div className="space-y-3">
                  {ratingStats.breakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm">{item.stars}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground w-16 text-right">
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="default">Все отзывы</Button>
                <Button size="sm" variant="outline">5 звезд</Button>
                <Button size="sm" variant="outline">4 звезды</Button>
                <Button size="sm" variant="outline">3 звезды</Button>
                <Button size="sm" variant="outline">С фото</Button>
                <Button size="sm" variant="outline">Проверенные</Button>
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Поиск по отзывам..." 
                    className="pl-10 w-64"
                  />
                </div>
                <Button size="icon" variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-muted/30 rounded-xl p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={review.avatar} 
                        alt={review.user}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{review.user}</h4>
                          {review.verified && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Проверен
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Товар: {review.product}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {review.date}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {review.text}
                    </p>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="font-medium text-green-700 mb-2">Плюсы:</h5>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-green-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">Минусы:</h5>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Полезно ({review.helpful})
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Ответить
                      </button>
                    </div>

                    <Button size="sm" variant="outline">
                      Посмотреть товар
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Показать еще отзывы
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Write Review CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Поделитесь своим мнением!</h2>
            <p className="text-xl mb-8 opacity-90">
              Расскажите другим покупателям о своем опыте использования наших товаров
            </p>
            <Button size="lg" variant="secondary">
              <User className="mr-2 w-5 h-5" />
              Написать отзыв
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 