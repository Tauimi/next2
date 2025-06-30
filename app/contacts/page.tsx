import { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const metadata: Metadata = {
  title: 'Контакты TechnoMart - Связаться с нами',
  description: 'Свяжитесь с TechnoMart: телефон, email, адрес офиса, режим работы. Форма обратной связи для консультации.',
  openGraph: {
    title: 'Контакты TechnoMart',
    description: 'Свяжитесь с нами для консультации и заказа',
  },
}

const contactInfo = [
  {
    icon: Phone,
    title: 'Телефон',
    primary: '+7 (800) 123-45-67',
    secondary: 'Бесплатно по России',
    description: 'Звоните с 9:00 до 18:00 (МСК)'
  },
  {
    icon: Mail,
    title: 'Email',
    primary: 'info@technomart.ru',
    secondary: 'support@technomart.ru',
    description: 'Ответим в течение 2 часов'
  },
  {
    icon: MapPin,
    title: 'Адрес',
    primary: 'г. Москва, ул. Тверская, 15',
    secondary: 'БЦ "Премиум", 5 этаж',
    description: 'Метро "Тверская", 3 мин пешком'
  },
  {
    icon: Clock,
    title: 'Режим работы',
    primary: 'Пн-Пт: 9:00 - 18:00',
    secondary: 'Сб-Вс: 10:00 - 16:00',
    description: 'Консультации без выходных'
  }
]

const departments = [
  {
    title: 'Отдел продаж',
    phone: '+7 (495) 123-45-67',
    email: 'sales@technomart.ru',
    description: 'Консультации по товарам, оформление заказов'
  },
  {
    title: 'Техническая поддержка',
    phone: '+7 (495) 123-45-68',
    email: 'support@technomart.ru',
    description: 'Помощь по техническим вопросам, гарантийное обслуживание'
  },
  {
    title: 'Корпоративные продажи',
    phone: '+7 (495) 123-45-69',
    email: 'corporate@technomart.ru',
    description: 'Работа с юридическими лицами, крупные заказы'
  },
  {
    title: 'Сервисный центр',
    phone: '+7 (495) 123-45-70',
    email: 'service@technomart.ru',
    description: 'Ремонт и обслуживание техники'
  }
]

const offices = [
  {
    city: 'Москва',
    address: 'ул. Тверская, 15, БЦ "Премиум"',
    phone: '+7 (495) 123-45-67',
    hours: 'Пн-Пт: 9:00-18:00, Сб-Вс: 10:00-16:00',
    coordinates: '55.7558, 37.6176'
  },
  {
    city: 'Санкт-Петербург',
    address: 'Невский пр., 45, ТЦ "Центральный"',
    phone: '+7 (812) 123-45-67',
    hours: 'Пн-Вс: 10:00-20:00',
    coordinates: '59.9311, 30.3609'
  },
  {
    city: 'Екатеринбург',
    address: 'ул. Ленина, 25, ТК "Европа"',
    phone: '+7 (343) 123-45-67',
    hours: 'Пн-Пт: 10:00-19:00, Сб-Вс: 10:00-18:00',
    coordinates: '56.8431, 60.6454'
  }
]

export default function ContactsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Свяжитесь с <span className="text-primary">нами</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Готовы ответить на ваши вопросы и помочь с выбором техники. 
              Множество способов связи для вашего удобства
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((contact, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{contact.title}</h3>
                <p className="font-medium text-secondary-900 mb-1">{contact.primary}</p>
                <p className="text-sm text-muted-foreground mb-2">{contact.secondary}</p>
                <p className="text-xs text-muted-foreground">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Напишите нам</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя *</label>
                    <Input placeholder="Ваше имя" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон *</label>
                    <Input placeholder="+7 (000) 000-00-00" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input type="email" placeholder="your@email.com" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Тема обращения</label>
                  <select className="w-full h-10 rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm">
                    <option>Консультация по товарам</option>
                    <option>Корпоративные продажи</option>
                    <option>Техническая поддержка</option>
                    <option>Гарантийное обслуживание</option>
                    <option>Другое</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение *</label>
                  <textarea 
                    className="w-full min-h-[120px] rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm resize-none"
                    placeholder="Опишите ваш вопрос или требования..."
                    required
                  />
                </div>
                
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy" className="mt-1" required />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground">
                    Согласен с <Link href="/privacy" className="text-primary hover:underline">политикой конфиденциальности</Link> и обработкой персональных данных
                  </label>
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 w-5 h-5" />
                  Отправить сообщение
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Как нас найти</h2>
              <div className="bg-muted rounded-lg h-96 flex items-center justify-center mb-6">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Интерактивная карта</p>
                  <p className="text-sm text-muted-foreground">г. Москва, ул. Тверская, 15</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">Как добраться:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>🚇 Метро "Тверская" - 3 минуты пешком</li>
                  <li>🚗 Платная парковка во дворе здания</li>
                  <li>🚌 Остановка "Тверская площадь" - 1 минута</li>
                  <li>🚶 Вход с Тверской улицы, 5 этаж</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Отделы и службы</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Свяжитесь с нужным отделом для быстрого решения вопроса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{dept.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${dept.phone}`} className="text-primary hover:underline">
                      {dept.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${dept.email}`} className="text-primary hover:underline">
                      {dept.email}
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши офисы</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Региональные представительства в крупных городах России
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-xl mb-4">{office.city}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">{office.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${office.phone}`} className="text-sm text-primary hover:underline">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm">{office.hours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick Help */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Частые вопросы</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Возможно, ответ на ваш вопрос уже есть в нашей базе знаний
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                question: 'Как оформить заказ?',
                answer: 'Добавьте товары в корзину и оформите заказ онлайн или позвоните нам'
              },
              {
                question: 'Есть ли доставка?',
                answer: 'Да, доставляем по Москве в день заказа, по России - 1-3 дня'
              },
              {
                question: 'Какая гарантия?',
                answer: 'Официальная гарантия производителя от 1 года на всю технику'
              },
              {
                question: 'Можно ли вернуть товар?',
                answer: 'Да, в течение 14 дней без объяснения причин'
              },
              {
                question: 'Есть ли скидки?',
                answer: 'Постоянные скидки, акции и специальные предложения'
              },
              {
                question: 'Работаете с юрлицами?',
                answer: 'Да, у нас есть отдел корпоративных продаж с особыми условиями'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <MessageCircle className="mr-2 w-5 h-5" />
              Смотреть все вопросы
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Нужна консультация?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Позвоните нам прямо сейчас или оставьте заявку на обратный звонок
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="mr-2 w-5 h-5" />
                +7 (800) 123-45-67
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Обратный звонок
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 