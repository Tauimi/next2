import { Metadata } from 'next'
import { Phone, Mail, MessageCircle, Clock, Users, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const metadata: Metadata = {
  title: 'Техническая поддержка - TechnoMart',
  description: 'Техническая поддержка TechnoMart. Помощь с товарами, консультации, решение проблем.',
}

export default function SupportPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Техническая <span className="text-primary">поддержка</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Помощь с выбором, настройкой и использованием техники
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Способы связи</h2>
              <p className="text-xl text-muted-foreground">
                Выберите удобный способ получения помощи
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Горячая линия</h3>
                <p className="text-muted-foreground mb-4">
                  Быстрая помощь по телефону от наших специалистов
                </p>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <a href="tel:+78001234567">+7 (800) 123-45-67</a>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Онлайн-чат</h3>
                <p className="text-muted-foreground mb-4">
                  Общение в реальном времени с техническими консультантами
                </p>
                <Button className="w-full" variant="outline">
                  Начать чат
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Среднее время ответа: 2 минуты
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Электронная почта</h3>
                <p className="text-muted-foreground mb-4">
                  Подробная консультация по электронной почте
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <a href="mailto:support@technomart.ru">support@technomart.ru</a>
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Ответ в течение 4 часов
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Виды поддержки</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  Консультации по выбору
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Подбор товара под ваши потребности</li>
                  <li>• Сравнение характеристик и моделей</li>
                  <li>• Рекомендации по совместимости</li>
                  <li>• Консультации по ценовой категории</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <Headphones className="w-6 h-6 text-primary" />
                  Техническая помощь
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Помощь с настройкой устройств</li>
                  <li>• Решение проблем совместимости</li>
                  <li>• Инструкции по использованию</li>
                  <li>• Диагностика неисправностей</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  Послепродажное обслуживание
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Гарантийное обслуживание</li>
                  <li>• Возврат и обмен товаров</li>
                  <li>• Помощь с документооборотом</li>
                  <li>• Отслеживание статуса заказов</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Обучение и инструкции
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Видеоуроки по настройке</li>
                  <li>• Пошаговые инструкции</li>
                  <li>• Рекомендации по эксплуатации</li>
                  <li>• Обновление программного обеспечения</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Задать вопрос</h2>
              <p className="text-muted-foreground">
                Опишите вашу проблему, и мы поможем найти решение
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя</label>
                  <Input placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <Input placeholder="+7 (___) ___-__-__" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Тема обращения</label>
                <select className="w-full p-3 border rounded-lg">
                  <option>Выберите тему</option>
                  <option>Помощь с выбором товара</option>
                  <option>Техническая поддержка</option>
                  <option>Гарантийное обслуживание</option>
                  <option>Возврат/обмен</option>
                  <option>Проблемы с заказом</option>
                  <option>Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Сообщение</label>
                <textarea 
                  rows={6}
                  className="w-full p-3 border rounded-lg resize-none"
                  placeholder="Опишите вашу проблему или вопрос подробно..."
                ></textarea>
              </div>

              <Button className="w-full" size="lg">
                Отправить обращение
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
} 