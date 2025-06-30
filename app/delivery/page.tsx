import { Metadata } from 'next'
import { Truck, Clock, CreditCard, MapPin, Shield, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Доставка и оплата - TechnoMart',
  description: 'Информация о способах доставки и оплаты в TechnoMart. Быстрая доставка по всей России, множество способов оплаты.',
}

const deliveryMethods = [
  {
    icon: Truck,
    title: 'Курьерская доставка',
    description: 'Доставка курьером до двери',
    areas: 'Москва и область',
    time: 'В день заказа или на следующий день',
    price: 'От 300₽, бесплатно от 5,000₽',
    features: ['Примерка перед покупкой', 'Оплата при получении', 'Удобное время доставки']
  },
  {
    icon: MapPin,
    title: 'Самовывоз',
    description: 'Забрать из пункта выдачи',
    areas: 'Москва, СПб, Екатеринбург',
    time: 'Через 2-4 часа после заказа',
    price: 'Бесплатно',
    features: ['Проверка товара', 'Быстрое получение', 'Удобные пункты выдачи']
  },
  {
    icon: Clock,
    title: 'Экспресс-доставка',
    description: 'Ускоренная доставка в день заказа',
    areas: 'Москва в пределах МКАД',
    time: 'В течение 3 часов',
    price: '999₽',
    features: ['Максимально быстро', 'Отслеживание курьера', 'SMS уведомления']
  }
]

const paymentMethods = [
  {
    icon: CreditCard,
    title: 'Банковские карты',
    description: 'Visa, MasterCard, МИР',
    features: ['Безопасные платежи', 'Мгновенное зачисление', '3D-Secure защита']
  },
  {
    icon: Phone,
    title: 'Электронные кошельки',
    description: 'ЮMoney, QIWI, WebMoney',
    features: ['Быстрая оплата', 'Без комиссий', 'Привычные сервисы']
  },
  {
    icon: Shield,
    title: 'При получении',
    description: 'Наличные или картой курьеру',
    features: ['Оплата после осмотра', 'Нет предоплаты', 'Максимальная безопасность']
  }
]

const deliveryZones = [
  {
    zone: 'Москва в пределах МКАД',
    time: 'В день заказа',
    price: '300₽',
    freeFrom: '5,000₽'
  },
  {
    zone: 'Московская область',
    time: '1-2 дня',
    price: '500₽',
    freeFrom: '7,000₽'
  },
  {
    zone: 'Санкт-Петербург',
    time: '1-2 дня',
    price: '400₽',
    freeFrom: '5,000₽'
  },
  {
    zone: 'Крупные города России',
    time: '2-5 дней',
    price: 'От 600₽',
    freeFrom: '10,000₽'
  },
  {
    zone: 'Отдаленные регионы',
    time: '3-7 дней',
    price: 'От 800₽',
    freeFrom: '15,000₽'
  }
]

export default function DeliveryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Доставка и <span className="text-primary">оплата</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Удобные способы доставки и оплаты для вашего комфорта
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Способы доставки</h2>
            <p className="text-xl text-muted-foreground">
              Выберите удобный способ получения заказа
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deliveryMethods.map((method, index) => (
              <div key={index} className="bg-muted/50 rounded-xl p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <method.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                <p className="text-muted-foreground mb-4">{method.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">География:</span>
                    <span className="text-sm font-medium">{method.areas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Время:</span>
                    <span className="text-sm font-medium">{method.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Стоимость:</span>
                    <span className="text-sm font-medium">{method.price}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {method.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
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

      {/* Delivery Zones Table */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Зоны доставки</h2>
            <p className="text-xl text-muted-foreground">
              Стоимость и сроки доставки по регионам
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Зона доставки</th>
                      <th className="px-6 py-4 text-left font-semibold">Сроки</th>
                      <th className="px-6 py-4 text-left font-semibold">Стоимость</th>
                      <th className="px-6 py-4 text-left font-semibold">Бесплатно от</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    {deliveryZones.map((zone, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium">{zone.zone}</td>
                        <td className="px-6 py-4 text-muted-foreground">{zone.time}</td>
                        <td className="px-6 py-4 text-muted-foreground">{zone.price}</td>
                        <td className="px-6 py-4 text-primary font-medium">{zone.freeFrom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Способы оплаты</h2>
            <p className="text-xl text-muted-foreground">
              Выберите удобный способ оплаты заказа
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paymentMethods.map((method, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <method.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                <p className="text-muted-foreground mb-6">{method.description}</p>
                
                <div className="space-y-2">
                  {method.features.map((feature, idx) => (
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

      {/* FAQ */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Можно ли изменить способ доставки после оформления заказа?',
                answer: 'Да, можно изменить способ доставки до момента передачи заказа в службу доставки. Свяжитесь с нами по телефону +7 (800) 123-45-67.'
              },
              {
                question: 'Что делать, если товар не подошел?',
                answer: 'Вы можете вернуть товар в течение 14 дней без объяснения причин. При курьерской доставке возможна примерка.'
              },
              {
                question: 'Есть ли ограничения по весу и размеру?',
                answer: 'Максимальный вес для курьерской доставки - 30 кг. Крупногабаритные товары доставляются отдельно.'
              },
              {
                question: 'Как отследить заказ?',
                answer: 'После отправки заказа вы получите трек-номер для отслеживания. Также статус можно проверить в личном кабинете.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
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
            <h2 className="text-3xl font-bold mb-4">Есть вопросы о доставке?</h2>
            <p className="text-xl mb-8 opacity-90">
              Свяжитесь с нами, и мы поможем выбрать оптимальный способ доставки
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="mr-2 w-5 h-5" />
                +7 (800) 123-45-67
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Онлайн-консультант
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 