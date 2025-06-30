import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Quote, Building, Users, Award, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Клиенты TechnoMart - Отзывы и партнеры',
  description: 'Отзывы довольных клиентов TechnoMart. Работаем с крупными компаниями, малым бизнесом и частными лицами.',
  openGraph: {
    title: 'Клиенты TechnoMart',
    description: 'Отзывы и истории успеха наших клиентов',
  },
}

const clientCategories = [
  { id: 'all', name: 'Все клиенты', count: 120 },
  { id: 'corporate', name: 'Корпоративные', count: 45 },
  { id: 'retail', name: 'Ритейл', count: 35 },
  { id: 'restaurants', name: 'Рестораны', count: 25 },
  { id: 'private', name: 'Частные лица', count: 15 },
]

const testimonials = [
  {
    id: '1',
    name: 'Алексей Морозов',
    position: 'IT-директор',
    company: 'ООО "ТехноСфера"',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'TechnoMart обеспечил комплексное техническое оснащение нашего нового офиса. Профессиональный подход, качественное оборудование и отличный сервис. Рекомендую всем!',
    date: '2024-01-15',
    project: 'Оснащение офиса на 200 рабочих мест',
    featured: true
  },
  {
    id: '2',
    name: 'Мария Петрова',
    position: 'Управляющий',
    company: 'Ресторан "Премиум"',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Полностью оснастили кухню ресторана современным оборудованием. Качество техники превосходное, а сервисное обслуживание на высшем уровне. Очень довольны сотрудничеством!',
    date: '2023-12-10',
    project: 'Техническое оснащение ресторана',
    featured: true
  },
  {
    id: '3',
    name: 'Дмитрий Иванов',
    position: 'Директор',
    company: 'ТЦ "Галерея"',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Модернизировали торговый центр с помощью TechnoMart. Новые LED-экраны, касовые системы и навигация значительно улучшили сервис для посетителей.',
    date: '2023-11-20',
    project: 'Модернизация торгового центра',
    featured: true
  },
  {
    id: '4',
    name: 'Екатерина Сидорова',
    position: 'Владелец',
    company: 'Частный дом',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Создали систему "умный дом" в нашем загородном доме. Автоматизация освещения, климата и безопасности превзошла все ожидания. Спасибо за профессионализм!',
    date: '2023-10-05',
    project: 'Система "умный дом"',
    featured: false
  },
  {
    id: '5',
    name: 'Андрей Козлов',
    position: 'Генеральный директор',
    company: 'Логистическая компания "Экспресс"',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Оснастили складской комплекс современными системами учета и безопасности. Эффективность работы повысилась на 40%. Отличная команда специалистов!',
    date: '2023-09-15',
    project: 'Автоматизация склада',
    featured: false
  },
  {
    id: '6',
    name: 'Ольга Васильева',
    position: 'Директор по развитию',
    company: 'Сеть магазинов "Электро+"',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'Партнерство с TechnoMart позволило нам оснастить 15 магазинов качественным оборудованием. Индивидуальный подход к каждому объекту и гибкие условия сотрудничества.',
    date: '2023-08-20',
    project: 'Оснащение сети магазинов',
    featured: false
  }
]

const partners = [
  {
    name: 'ООО "ТехноСфера"',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&crop=center',
    industry: 'IT-услуги',
    cooperation: '3 года'
  },
  {
    name: 'Ресторан "Премиум"',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=100&fit=crop&crop=center',
    industry: 'Ресторанный бизнес',
    cooperation: '2 года'
  },
  {
    name: 'ТЦ "Галерея"',
    logo: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=200&h=100&fit=crop&crop=center',
    industry: 'Торговые центры',
    cooperation: '4 года'
  },
  {
    name: 'Банк "Развитие"',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop&crop=center',
    industry: 'Банковские услуги',
    cooperation: '5 лет'
  },
  {
    name: 'Клиника "Здоровье+"',
    logo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200&h=100&fit=crop&crop=center',
    industry: 'Медицина',
    cooperation: '2 года'
  },
  {
    name: 'Отель "Комфорт"',
    logo: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200&h=100&fit=crop&crop=center',
    industry: 'Гостиничный бизнес',
    cooperation: '3 года'
  }
]

const stats = [
  { icon: Users, label: 'Довольных клиентов', value: '120+' },
  { icon: Building, label: 'Корпоративных проектов', value: '80+' },
  { icon: Award, label: 'Лет партнерства (в среднем)', value: '3+' },
  { icon: TrendingUp, label: 'Повторных обращений', value: '85%' },
]

export default function ClientsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Наши <span className="text-primary">клиенты</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Более 120 довольных клиентов доверяют нам техническое оснащение 
              своих проектов. Читайте отзывы и истории успеха
            </p>
            <Button size="lg" asChild>
              <Link href="/contacts">
                <>
                  Стать клиентом
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
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
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Отзывы клиентов</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Что говорят о нас наши клиенты
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {testimonials.filter(t => t.featured).map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    <p className="text-sm text-primary">{testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-secondary-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="relative mb-4">
                  <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground italic pl-6">
                    {testimonial.content}
                  </p>
                </div>
                
                <div className="text-sm text-muted-foreground border-t pt-4">
                  <p className="font-medium">Проект: {testimonial.project}</p>
                  <p>{new Date(testimonial.date).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* All Testimonials */}
          <div className="space-y-6">
            {testimonials.filter(t => !t.featured).map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-secondary-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{testimonial.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Проект: {testimonial.project}</span>
                      <span>{new Date(testimonial.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши партнеры</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Компании, которые доверяют нам техническое оснащение своего бизнеса
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="relative h-16 mb-4">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-semibold mb-2">{partner.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{partner.industry}</p>
                <p className="text-xs text-primary">Сотрудничаем {partner.cooperation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Clients */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Почему клиенты выбирают нас</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Преимущества работы с TechnoMart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Индивидуальный подход',
                description: 'Каждый проект уникален. Мы учитываем все особенности вашего бизнеса.',
                icon: '🎯'
              },
              {
                title: 'Гарантия качества',
                description: 'Официальная гарантия на все оборудование и выполненные работы.',
                icon: '🛡️'
              },
              {
                title: 'Комплексные решения',
                description: 'От консультации до сервисного обслуживания - все в одном месте.',
                icon: '🔧'
              },
              {
                title: 'Быстрая реализация',
                description: 'Соблюдаем сроки и выполняем проекты точно в срок.',
                icon: '⚡'
              },
              {
                title: 'Конкурентные цены',
                description: 'Работаем напрямую с производителями, предлагаем лучшие цены.',
                icon: '💰'
              },
              {
                title: 'Долгосрочная поддержка',
                description: 'Сервисное обслуживание и техническая поддержка 24/7.',
                icon: '🤝'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Присоединяйтесь к нашим клиентам
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Получите бесплатную консультацию и узнайте, как мы можем помочь вашему бизнесу
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Бесплатная консультация
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Смотреть проекты
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 