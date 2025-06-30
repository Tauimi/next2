import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users, Building, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Проекты TechnoMart - Портфолио реализованных решений',
  description: 'Ознакомьтесь с портфолио проектов TechnoMart. Офисы, дома, рестораны - мы поставляем технику для любых задач.',
  openGraph: {
    title: 'Проекты TechnoMart',
    description: 'Портфолио реализованных технологических решений',
  },
}

const projectCategories = [
  { id: 'all', name: 'Все проекты', count: 24 },
  { id: 'office', name: 'Офисы', count: 8 },
  { id: 'retail', name: 'Торговля', count: 6 },
  { id: 'restaurant', name: 'Рестораны', count: 4 },
  { id: 'home', name: 'Частные дома', count: 6 },
]

const featuredProjects = [
  {
    id: '1',
    title: 'Оснащение офиса IT-компании',
    category: 'office',
    categoryName: 'Офисы',
    client: 'TechSolutions LLC',
    location: 'Москва',
    date: '2024-01-15',
    status: 'completed' as const,
    budget: '2,500,000',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center',
    description: 'Комплексное оснащение современного офиса техникой: рабочие места, переговорные, серверная.',
    technologies: ['Компьютеры', 'Серверы', 'Сетевое оборудование', 'Мониторы'],
    results: [
      'Повышение производительности на 40%',
      'Сокращение времени простоев на 60%',
      'Удовлетворенность сотрудников 95%'
    ]
  },
  {
    id: '2',
    title: 'Техническое оснащение ресторана',
    category: 'restaurant',
    categoryName: 'Рестораны',
    client: 'Ресторан "Премиум"',
    location: 'Санкт-Петербург',
    date: '2023-12-10',
    status: 'completed' as const,
    budget: '1,800,000',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop&crop=center',
    description: 'Полное техническое оснащение кухни и зала ресторана премиум-класса.',
    technologies: ['Холодильное оборудование', 'Плиты', 'POS-системы', 'Аудиосистемы'],
    results: [
      'Сокращение времени приготовления на 30%',
      'Увеличение пропускной способности',
      'Соответствие всем стандартам HACCP'
    ]
  },
  {
    id: '3',
    title: 'Умный дом в Подмосковье',
    category: 'home',
    categoryName: 'Частные дома',
    client: 'Семья Ивановых',
    location: 'Московская область',
    date: '2023-11-20',
    status: 'completed' as const,
    budget: '3,200,000',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&crop=center',
    description: 'Создание системы "умный дом" с интеграцией всех технических устройств.',
    technologies: ['Умные выключатели', 'Климат-контроль', 'Безопасность', 'Мультимедиа'],
    results: [
      'Экономия электроэнергии на 35%',
      'Полная автоматизация дома',
      'Повышение безопасности и комфорта'
    ]
  },
  {
    id: '4',
    title: 'Модернизация торгового центра',
    category: 'retail',
    categoryName: 'Торговля',
    client: 'ТЦ "Галерея"',
    location: 'Екатеринбург',
    date: '2023-10-05',
    status: 'completed' as const,
    budget: '5,000,000',
    image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=600&h=400&fit=crop&crop=center',
    description: 'Комплексная модернизация технического оснащения торгового центра.',
    technologies: ['LED-экраны', 'Касовые системы', 'Системы безопасности', 'Навигация'],
    results: [
      'Увеличение посещаемости на 25%',
      'Современная навигация',
      'Повышение уровня безопасности'
    ]
  }
]

const stats = [
  { label: 'Завершенных проектов', value: '150+' },
  { label: 'Довольных клиентов', value: '120+' },
  { label: 'Лет опыта', value: '10+' },
  { label: 'Млн рублей оборот', value: '500+' },
]

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Наши <span className="text-primary">проекты</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Более 150 реализованных проектов по оснащению офисов, ресторанов, 
              торговых центров и частных домов современной техникой
            </p>
            <Button size="lg" asChild>
              <Link href="/contacts">
                <>
                  Обсудить проект
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
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
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

      {/* Projects Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Избранные проекты</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Примеры наших лучших работ в различных сферах
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {projectCategories.map((category) => (
              <Button
                key={category.id}
                variant={category.id === 'all' ? 'default' : 'outline'}
                className="rounded-full"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {project.categoryName}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Завершен
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-primary" />
                      <span>{project.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(project.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{project.budget} ₽</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Использованные технологии:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-muted px-2 py-1 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Результаты:</h4>
                    <ul className="space-y-1">
                      {project.results.map((result, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Подробнее о проекте
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Смотреть все проекты
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как мы работаем</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Отлаженный процесс реализации проектов любой сложности
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Консультация',
                description: 'Изучаем ваши потребности и цели проекта'
              },
              {
                step: '02',
                title: 'Планирование',
                description: 'Разрабатываем техническое решение и смету'
              },
              {
                step: '03',
                title: 'Реализация',
                description: 'Поставляем оборудование и выполняем монтаж'
              },
              {
                step: '04',
                title: 'Поддержка',
                description: 'Обеспечиваем сервисное обслуживание'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {process.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{process.title}</h3>
                <p className="text-muted-foreground text-sm">{process.description}</p>
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
              Готовы реализовать ваш проект?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Получите бесплатную консультацию и расчет стоимости проекта
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Бесплатная консультация
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Смотреть портфолио
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 