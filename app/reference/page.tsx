import { Metadata } from 'next'
import { BookOpen, Phone, Mail, Clock, MapPin, CreditCard, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Справка - TechnoMart',
  description: 'Справочная информация TechnoMart: контакты, режим работы, способы оплаты, доставка.',
}

const quickInfo = [
  {
    icon: Clock,
    title: 'Режим работы',
    content: [
      'Пн-Пт: 9:00-18:00',
      'Сб: 10:00-16:00',
      'Вс: выходной'
    ]
  },
  {
    icon: Phone,
    title: 'Контакты',
    content: [
      '+7 (800) 123-45-67',
      'info@technomart.ru',
      'support@technomart.ru'
    ]
  },
  {
    icon: MapPin,
    title: 'Адрес',
    content: [
      'г. Москва',
      'ул. Технологическая, д. 15',
      'м. Технопарк'
    ]
  },
  {
    icon: CreditCard,
    title: 'Способы оплаты',
    content: [
      'Наличные при получении',
      'Банковские карты',
      'Безналичный расчет'
    ]
  }
]

const deliveryZones = [
  { zone: 'Москва (в пределах МКАД)', price: 'Бесплатно от 5000₽', time: 'В день заказа' },
  { zone: 'Московская область', price: 'от 500₽', time: '1-2 дня' },
  { zone: 'Регионы России', price: 'от 800₽', time: '3-7 дней' }
]

export default function ReferencePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Справка</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Основная информация о работе TechnoMart
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickInfo.map((info, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-sm text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Truck className="w-8 h-8 text-primary" />
                Доставка
              </h2>
            </div>

            <div className="space-y-4">
              {deliveryZones.map((zone, index) => (
                <div key={index} className="bg-white rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">{zone.zone}</h4>
                    <p className="text-sm text-muted-foreground">Срок: {zone.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{zone.price}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/delivery">Подробнее о доставке</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Гарантия
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">12-36</div>
                <div className="text-sm text-muted-foreground">месяцев гарантии</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">14</div>
                <div className="text-sm text-muted-foreground">дней на возврат</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">поддержка</div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/warranty">Условия гарантии</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Полезные ссылки</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Помощь
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                  <li><Link href="/help/support" className="text-muted-foreground hover:text-primary">Техподдержка</Link></li>
                  <li><Link href="/help/instructions" className="text-muted-foreground hover:text-primary">Инструкции</Link></li>
                  <li><Link href="/returns" className="text-muted-foreground hover:text-primary">Возврат товара</Link></li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Покупки
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/catalog" className="text-muted-foreground hover:text-primary">Каталог</Link></li>
                  <li><Link href="/compare" className="text-muted-foreground hover:text-primary">Сравнение</Link></li>
                  <li><Link href="/reviews" className="text-muted-foreground hover:text-primary">Отзывы</Link></li>
                  <li><Link href="/wishlist" className="text-muted-foreground hover:text-primary">Избранное</Link></li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Связь
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/contacts" className="text-muted-foreground hover:text-primary">Контакты</Link></li>
                  <li><Link href="/about" className="text-muted-foreground hover:text-primary">О компании</Link></li>
                  <li><Link href="/services" className="text-muted-foreground hover:text-primary">Услуги</Link></li>
                  <li><Link href="/projects" className="text-muted-foreground hover:text-primary">Проекты</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Экстренная связь</h2>
            <p className="text-xl mb-8 opacity-90">
              Если у вас срочный вопрос или проблема с заказом
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="w-5 h-5 mr-2" />
                +7 (800) 123-45-67
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                <Mail className="w-5 h-5 mr-2" />
                Написать в поддержку
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 