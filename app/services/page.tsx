'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Wrench, Truck, Shield, Phone, Clock, Users, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'



const services = [
  {
    title: 'Доставка и установка',
    icon: Truck,
    description: 'Быстрая доставка и профессиональная установка техники',
    features: [
      'Доставка в день заказа',
      'Профессиональная установка',
      'Настройка оборудования',
      'Инструктаж по использованию'
    ],
    price: 'от 500₽',
    popular: true
  },
  {
    title: 'Техническое обслуживание',
    icon: Wrench,
    description: 'Ремонт и обслуживание электроники любой сложности',
    features: [
      'Диагностика неисправностей',
      'Ремонт любой сложности',
      'Замена комплектующих',
      'Профилактическое обслуживание'
    ],
    price: 'от 1000₽',
    popular: false
  },
  {
    title: 'Расширенная гарантия',
    icon: Shield,
    description: 'Дополнительная защита вашей техники до 3 лет',
    features: [
      'Гарантия до 3 лет',
      'Бесплатный ремонт',
      'Замена при поломке',
      'Приоритетное обслуживание'
    ],
    price: 'от 2000₽',
    popular: false
  },
  {
    title: 'Консультации и обучение',
    icon: Users,
    description: 'Персональные консультации и обучение работе с техникой',
    features: [
      'Персональные консультации',
      'Обучение работе с ПО',
      'Настройка под задачи',
      'Удаленная поддержка'
    ],
    price: 'от 800₽',
    popular: false
  }
]

const advantages = [
  {
    icon: Star,
    title: 'Профессионализм',
    description: 'Сертифицированные специалисты с опытом работы более 5 лет'
  },
  {
    icon: Clock,
    title: 'Оперативность',
    description: 'Выполнение работ в кратчайшие сроки, соблюдение договоренностей'
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Гарантия на все виды выполняемых работ до 12 месяцев'
  },
  {
    icon: Phone,
    title: 'Поддержка 24/7',
    description: 'Круглосуточная техническая поддержка и консультации'
  }
]

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState('')

  const scrollToForm = (serviceName: string) => {
    setSelectedService(serviceName)
    const formElement = document.getElementById('order-form')
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Заказать <span className="text-primary">услугу</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Оставьте заявку, и мы свяжемся с вами в течение 15 минут
            </p>
            <Button size="lg" onClick={() => scrollToForm('Консультация')}>
              <Phone className="w-5 h-5 mr-2" />
              Заказать консультацию
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Что мы предлагаем</h2>
              <p className="text-xl text-muted-foreground">
                Профессиональные услуги для любых потребностей
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className={`relative bg-muted/50 rounded-xl p-8 hover:shadow-lg transition-shadow ${
                  service.popular ? 'ring-2 ring-primary' : ''
                }`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-6 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Популярно
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <Button onClick={() => scrollToForm(service.title)}>Заказать</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground text-sm">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Как мы работаем</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: 1, title: 'Заявка', description: 'Оставьте заявку на сайте или по телефону' },
                { step: 2, title: 'Консультация', description: 'Наш специалист свяжется с вами для уточнения деталей' },
                { step: 3, title: 'Выполнение', description: 'Выполняем работы качественно и в срок' },
                { step: 4, title: 'Результат', description: 'Сдаем работу и предоставляем гарантию' }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="order-form" className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Заказать услугу</h2>
              <p className="text-xl opacity-90">
                Оставьте заявку, и мы свяжемся с вами в течение 15 минут
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Ваше имя" className="bg-white text-black" />
                    <Input placeholder="Телефон" className="bg-white text-black" />
                  </div>
                  <Input placeholder="Email" className="bg-white text-black" />
                  <select 
                    className="w-full p-3 border rounded-lg bg-white text-black"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Выберите услугу</option>
                    <option value="Доставка и установка">Доставка и установка</option>
                    <option value="Техническое обслуживание">Техническое обслуживание</option>
                    <option value="Расширенная гарантия">Расширенная гарантия</option>
                    <option value="Консультации и обучение">Консультации и обучение</option>
                    <option value="Консультация">Консультация</option>
                  </select>
                  <textarea 
                    rows={4}
                    className="w-full p-3 border rounded-lg resize-none bg-white text-black"
                    placeholder="Опишите ваши потребности..."
                  ></textarea>
                  <Button size="lg" variant="secondary" className="w-full">
                    Отправить заявку
                  </Button>
                </form>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Контактная информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <span>+7 (800) 123-45-67</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <span>Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Время отклика</h3>
                  <ul className="space-y-2">
                    <li>• Звонок в течение 15 минут</li>
                    <li>• Выезд специалиста в день обращения</li>
                    <li>• Быстрое решение проблем</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 