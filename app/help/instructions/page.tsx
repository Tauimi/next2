import { Metadata } from 'next'
import { BookOpen, Download, Play, Search, Smartphone, Laptop, Tv } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const metadata: Metadata = {
  title: 'Инструкции - TechnoMart',
  description: 'Инструкции по использованию техники. Руководства пользователя, видеоуроки, советы по настройке.',
}

const instructionCategories = [
  {
    title: 'Смартфоны и планшеты',
    icon: Smartphone,
    color: 'bg-blue-500',
    count: 24,
    guides: [
      'Первоначальная настройка iPhone',
      'Перенос данных с Android на iOS',
      'Настройка Face ID и Touch ID',
      'Оптимизация батареи смартфона'
    ]
  },
  {
    title: 'Ноутбуки и ПК',
    icon: Laptop,
    color: 'bg-green-500',
    count: 18,
    guides: [
      'Первый запуск Windows 11',
      'Настройка Wi-Fi подключения',
      'Установка драйверов',
      'Оптимизация производительности'
    ]
  },
  {
    title: 'Телевизоры',
    icon: Tv,
    color: 'bg-purple-500',
    count: 12,
    guides: [
      'Подключение к интернету',
      'Настройка Smart TV',
      'Подключение внешних устройств',
      'Калибровка изображения'
    ]
  }
]

const popularInstructions = [
  {
    title: 'Настройка нового iPhone 15',
    duration: '15 мин',
    type: 'video',
    views: '125k',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop'
  },
  {
    title: 'Подключение AirPods к устройствам',
    duration: '8 мин',
    type: 'video',
    views: '89k',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop'
  },
  {
    title: 'Настройка MacBook для работы',
    duration: '22 мин',
    type: 'guide',
    views: '67k',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop'
  },
  {
    title: 'Smart TV: первые шаги',
    duration: '12 мин',
    type: 'video',
    views: '54k',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop'
  }
]

export default function InstructionsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Инструкции и <span className="text-primary">руководства</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Подробные инструкции по настройке и использованию техники
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Поиск инструкций..." 
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Категории инструкций</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {instructionCategories.map((category, index) => (
                <div key={index} className="bg-muted/50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} инструкций</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.guides.map((guide, guideIndex) => (
                      <div key={guideIndex} className="flex items-center gap-3 text-sm">
                        <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{guide}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6" variant="outline">
                    Посмотреть все
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Instructions */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Популярные инструкции</h2>
              <p className="text-xl text-muted-foreground">
                Самые востребованные руководства и видеоуроки
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularInstructions.map((instruction, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={instruction.image} 
                      alt={instruction.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        instruction.type === 'video' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {instruction.type === 'video' ? 'Видео' : 'Руководство'}
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {instruction.duration}
                      </div>
                    </div>
                    {instruction.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary ml-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{instruction.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{instruction.views} просмотров</span>
                      <Button size="sm" variant="ghost">
                        {instruction.type === 'video' ? (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Смотреть
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            Скачать
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Не нашли нужную инструкцию?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Свяжитесь с нашими специалистами за персональной помощью
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Задать вопрос
              </Button>
              <Button size="lg" variant="outline">
                Заказать консультацию
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">54+</div>
                <div className="text-sm text-muted-foreground">Видеоинструкций</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">128+</div>
                <div className="text-sm text-muted-foreground">PDF руководств</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Поддержка</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 