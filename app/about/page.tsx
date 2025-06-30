import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Users, Award, Truck, Phone, MapPin, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'О компании TechnoMart - Надежный партнер в мире технологий',
  description: 'TechnoMart - ведущий поставщик электроники и бытовой техники. Более 10 лет на рынке, тысячи довольных клиентов, гарантия качества.',
  openGraph: {
    title: 'О компании TechnoMart',
    description: 'Ведущий поставщик электроники и бытовой техники',
  },
}

const stats = [
  { icon: Users, label: 'Клиентов', value: '15,000+' },
  { icon: Award, label: 'Лет на рынке', value: '10+' },
  { icon: Shield, label: 'Товаров в каталоге', value: '50,000+' },
  { icon: Truck, label: 'Заказов доставлено', value: '100,000+' },
]

const advantages = [
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Все товары проходят строгий контроль качества. Официальная гарантия от производителей.'
  },
  {
    icon: Truck,
    title: 'Быстрая доставка',
    description: 'Доставка по Москве и области в день заказа. По России - от 1-3 дней.'
  },
  {
    icon: Users,
    title: 'Профессиональные консультации',
    description: 'Наши специалисты помогут выбрать идеальное решение для ваших задач.'
  },
  {
    icon: Star,
    title: 'Лучшие цены',
    description: 'Работаем напрямую с производителями, что позволяет предлагать выгодные цены.'
  }
]

const team = [
  {
    name: 'Александр Петров',
    position: 'Генеральный директор',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    description: 'Более 15 лет в сфере розничной торговли электроникой'
  },
  {
    name: 'Елена Сидорова',
    position: 'Коммерческий директор',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    description: 'Эксперт по закупкам и развитию ассортимента'
  },
  {
    name: 'Михаил Иванов',
    position: 'Технический директор',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    description: 'Специалист по современным технологиям и инновациям'
  }
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              О компании <span className="text-primary">TechnoMart</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Мы — ведущий поставщик электроники и бытовой техники, который более 10 лет 
              помогает клиентам находить идеальные технологические решения
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/catalog">
                  <>
                    Смотреть каталог
                    <MapPin className="ml-2 w-5 h-5" />
                  </>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contacts">
                  <>
                    Связаться с нами
                    <Phone className="ml-2 w-5 h-5" />
                  </>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Наша история</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="mb-4">
                  TechnoMart был основан в 2014 году с простой миссией — сделать 
                  современные технологии доступными для каждого. Мы начинали как 
                  небольшой магазин электроники, но благодаря качественному сервису 
                  и широкому ассортименту быстро завоевали доверие клиентов.
                </p>
                <p className="mb-4">
                  Сегодня мы — один из ведущих онлайн-ритейлеров в сфере электроники 
                  и бытовой техники. Наш каталог включает более 50,000 товаров от 
                  ведущих мировых брендов.
                </p>
                <p>
                  Мы гордимся тем, что помогли тысячам клиентов найти идеальные 
                  технологические решения для дома, офиса и бизнеса.
                </p>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=500&fit=crop&crop=center"
                alt="Офис TechnoMart"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы предлагаем не просто товары, а комплексные решения с полным 
              сервисным сопровождением
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <advantage.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{advantage.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наша команда</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Профессионалы с многолетним опытом в сфере технологий и розничной торговли
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.position}</p>
                <p className="text-muted-foreground text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Как с нами связаться</h2>
              <p className="text-xl text-muted-foreground">
                Мы всегда готовы ответить на ваши вопросы и помочь с выбором
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Телефон</h3>
                <p className="text-muted-foreground">+7 (800) 123-45-67</p>
                <p className="text-sm text-muted-foreground">Бесплатно по России</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Адрес</h3>
                <p className="text-muted-foreground">г. Москва, ул. Тверская, 15</p>
                <p className="text-sm text-muted-foreground">Станция метро "Тверская"</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Режим работы</h3>
                <p className="text-muted-foreground">Пн-Пт: 9:00-18:00</p>
                <p className="text-sm text-muted-foreground">Сб-Вс: 10:00-16:00</p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/contacts">
                  <>
                    Подробная информация
                    <MapPin className="ml-2 w-5 h-5" />
                  </>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 