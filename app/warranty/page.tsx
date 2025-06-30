import { Metadata } from 'next'
import { Shield, Clock, FileText, Phone, Settings, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Гарантия и сервис - TechnoMart',
  description: 'Гарантийные условия TechnoMart. Официальная гарантия производителя, сервисное обслуживание, ремонт техники.',
}

const warrantyTerms = [
  {
    category: 'Смартфоны и планшеты',
    term: '12-24 месяца',
    description: 'Официальная гарантия производителя',
    conditions: ['Сохранение товарного вида', 'Наличие документов', 'Отсутствие механических повреждений']
  },
  {
    category: 'Ноутбуки и компьютеры',
    term: '12-36 месяцев',
    description: 'Расширенная гарантия на комплектующие',
    conditions: ['Правильная эксплуатация', 'Отсутствие вскрытия корпуса', 'Использование лицензионного ПО']
  },
  {
    category: 'Бытовая техника',
    term: '12-60 месяцев',
    description: 'Гарантия зависит от производителя',
    conditions: ['Соблюдение правил эксплуатации', 'Своевременное ТО', 'Использование оригинальных расходников']
  },
  {
    category: 'Аксессуары',
    term: '6-12 месяцев',
    description: 'Стандартная гарантия',
    conditions: ['Отсутствие механических повреждений', 'Правильное использование', 'Сохранение упаковки']
  }
]

const serviceTypes = [
  {
    icon: Settings,
    title: 'Гарантийный ремонт',
    description: 'Бесплатный ремонт в рамках гарантии',
    features: ['Диагностика бесплатно', 'Оригинальные запчасти', 'Срок ремонта до 21 дня']
  },
  {
    icon: Clock,
    title: 'Послегарантийный сервис',
    description: 'Ремонт после окончания гарантии',
    features: ['Диагностика от 500₽', 'Качественные запчасти', 'Гарантия на ремонт 3 месяца']
  },
  {
    icon: FileText,
    title: 'Техническая поддержка',
    description: 'Консультации по эксплуатации',
    features: ['Помощь в настройке', 'Решение проблем', 'Инструкции по использованию']
  }
]

export default function WarrantyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Гарантия и <span className="text-primary">сервис</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Надежная защита ваших покупок и качественное сервисное обслуживание
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Terms */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Гарантийные условия</h2>
            <p className="text-xl text-muted-foreground">
              Сроки гарантии для различных категорий товаров
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {warrantyTerms.map((item, index) => (
              <div key={index} className="bg-muted/50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{item.category}</h3>
                    <p className="text-primary font-medium">{item.term}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{item.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Условия гарантии:</h4>
                  {item.conditions.map((condition, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Виды сервисного обслуживания</h2>
            <p className="text-xl text-muted-foreground">
              Полный спектр услуг по обслуживанию техники
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceTypes.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как оформить гарантийный случай</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Обращение',
                  description: 'Свяжитесь с нами по телефону или через сайт'
                },
                {
                  step: '2',
                  title: 'Диагностика',
                  description: 'Принесите товар в сервисный центр для диагностики'
                },
                {
                  step: '3',
                  title: 'Ремонт',
                  description: 'При подтверждении гарантийного случая выполняем ремонт'
                },
                {
                  step: '4',
                  title: 'Получение',
                  description: 'Забираете отремонтированный товар'
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-3">Важная информация</h3>
                  <div className="space-y-2 text-sm text-amber-700">
                    <p>• Гарантия не распространяется на повреждения от неправильной эксплуатации</p>
                    <p>• Для гарантийного обслуживания необходимы документы о покупке</p>
                    <p>• Самостоятельный ремонт или вскрытие аннулирует гарантию</p>
                    <p>• Косметические повреждения не являются гарантийным случаем</p>
                    <p>• Срок гарантии может быть продлен при покупке расширенной гарантии</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Что делать, если товар сломался в первые дни?',
                answer: 'В течение 14 дней вы можете обменять товар или вернуть деньги. Если прошло больше времени - обращайтесь в гарантийный сервис.'
              },
              {
                question: 'Можно ли продлить гарантию?',
                answer: 'Да, при покупке можно оформить расширенную гарантию на срок до 3 лет дополнительно.'
              },
              {
                question: 'Сколько длится гарантийный ремонт?',
                answer: 'Согласно закону, срок гарантийного ремонта не должен превышать 45 дней. Обычно мы укладываемся в 7-21 день.'
              },
              {
                question: 'Что включает в себя гарантийное обслуживание?',
                answer: 'Бесплатная диагностика, ремонт или замена дефектных деталей, настройка и проверка работоспособности.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Нужна помощь с гарантией?</h2>
            <p className="text-xl mb-8 opacity-90">
              Обратитесь к нашим специалистам для решения любых вопросов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="mr-2 w-5 h-5" />
                Сервисный центр
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Оформить заявку
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 