import { Metadata } from 'next'
import { Search, ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const metadata: Metadata = {
  title: 'Часто задаваемые вопросы - TechnoMart',
  description: 'Ответы на частые вопросы о заказах, доставке, оплате, гарантии и возврате товаров в TechnoMart.',
}

const faqCategories = [
  { id: 'all', name: 'Все вопросы', count: 42 },
  { id: 'orders', name: 'Заказы', count: 12 },
  { id: 'delivery', name: 'Доставка', count: 8 },
  { id: 'payment', name: 'Оплата', count: 6 },
  { id: 'warranty', name: 'Гарантия', count: 9 },
  { id: 'returns', name: 'Возврат', count: 7 },
]

const faqData = [
  {
    category: 'orders',
    question: 'Как оформить заказ в интернет-магазине?',
    answer: `Для оформления заказа:
    1. Добавьте нужные товары в корзину
    2. Перейдите в корзину и нажмите "Оформить заказ"
    3. Заполните контактные данные
    4. Выберите способ доставки и оплаты
    5. Подтвердите заказ
    
    После оформления вы получите SMS и email с номером заказа.`
  },
  {
    category: 'orders',
    question: 'Можно ли изменить или отменить заказ?',
    answer: 'Да, вы можете изменить или отменить заказ до момента его передачи в службу доставки. Обычно это 2-4 часа после оформления. Свяжитесь с нами по телефону +7 (800) 123-45-67.'
  },
  {
    category: 'orders',
    question: 'Как отследить статус заказа?',
    answer: 'Отследить заказ можно несколькими способами: в личном кабинете на сайте, по ссылке из SMS-уведомления, или по номеру заказа на странице "Отследить заказ".'
  },
  {
    category: 'delivery',
    question: 'Какие способы доставки доступны?',
    answer: `Мы предлагаем несколько способов доставки:
    • Курьерская доставка по Москве и области
    • Самовывоз из пунктов выдачи
    • Экспресс-доставка в день заказа
    • Почтовая доставка по России
    
    Подробная информация о сроках и стоимости на странице "Доставка и оплата".`
  },
  {
    category: 'delivery',
    question: 'Сколько стоит доставка?',
    answer: 'Стоимость доставки зависит от региона и веса товара. По Москве от 300₽, по России от 500₽. Бесплатная доставка при заказе от 5,000₽ по Москве и от 10,000₽ по России.'
  },
  {
    category: 'delivery',
    question: 'В какое время происходит доставка?',
    answer: 'Доставка курьером осуществляется с 9:00 до 21:00. Вы можете выбрать удобный временной интервал: утро (9:00-14:00), день (14:00-18:00) или вечер (18:00-21:00).'
  },
  {
    category: 'payment',
    question: 'Какие способы оплаты принимаются?',
    answer: `Мы принимаем различные способы оплаты:
    • Банковские карты (Visa, MasterCard, МИР)
    • Электронные кошельки (ЮMoney, QIWI)
    • Наличные при получении
    • Безналичный расчет для юр. лиц
    • Рассрочка и кредит`
  },
  {
    category: 'payment',
    question: 'Безопасно ли платить картой на сайте?',
    answer: 'Да, абсолютно безопасно. Мы используем защищенное SSL-соединение и технологию 3D-Secure. Данные карты не сохраняются на наших серверах и передаются напрямую в банк.'
  },
  {
    category: 'warranty',
    question: 'Какая гарантия на товары?',
    answer: 'Гарантия зависит от типа товара: смартфоны и планшеты - 12-24 месяца, ноутбуки - 12-36 месяцев, бытовая техника - 12-60 месяцев. Действует официальная гарантия производителя.'
  },
  {
    category: 'warranty',
    question: 'Что делать, если товар сломался?',
    answer: 'При поломке в гарантийный период обратитесь в наш сервисный центр. Приносите товар с документами о покупке. Диагностика бесплатна, ремонт выполняется в течение 7-21 дня.'
  },
  {
    category: 'warranty',
    question: 'Что не покрывает гарантия?',
    answer: 'Гарантия не покрывает: механические повреждения, попадание влаги, последствия самостоятельного ремонта, нарушение правил эксплуатации, косметические дефекты от нормального использования.'
  },
  {
    category: 'returns',
    question: 'Можно ли вернуть товар?',
    answer: 'Да, товар можно вернуть в течение 14 дней без объяснения причин, если он не был в употреблении и сохранен товарный вид. Технически сложные товары возвращаются только при наличии недостатков.'
  },
  {
    category: 'returns',
    question: 'Как оформить возврат?',
    answer: `Для возврата товара:
    1. Свяжитесь с нами по телефону или email
    2. Опишите причину возврата
    3. Получите номер возврата
    4. Привезите товар с документами
    5. Получите деньги в течение 10 дней`
  },
  {
    category: 'orders',
    question: 'Работаете ли вы с юридическими лицами?',
    answer: 'Да, у нас есть отдел корпоративных продаж. Работаем по договорам, предоставляем отсрочку платежа, готовим коммерческие предложения. Звоните +7 (495) 123-45-69.'
  },
  {
    category: 'delivery',
    question: 'Доставляете ли в регионы?',
    answer: 'Да, доставляем по всей России через транспортные компании. Сроки доставки 2-7 дней в зависимости от региона. Возможна доставка до терминала или до адреса.'
  }
]

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Часто задаваемые <span className="text-primary">вопросы</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Найдите ответы на популярные вопросы о заказах, доставке и обслуживании
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Поиск по вопросам..." 
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={category.id === 'all' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-muted/50 rounded-lg">
                  <button className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/70 transition-colors rounded-lg">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                        <div className="text-muted-foreground whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground ml-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Полезная статистика</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Среднее время ответа', value: '< 2 часов' },
              { label: 'Решение проблем', value: '99.2%' },
              { label: 'Довольных клиентов', value: '98.5%' },
              { label: 'Быстрых ответов', value: '< 5 мин' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Не нашли ответ на вопрос?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Наши специалисты всегда готовы помочь вам
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Позвонить</h3>
                <p className="text-sm text-muted-foreground mb-4">Быстрая помощь по телефону</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+78001234567">+7 (800) 123-45-67</a>
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Онлайн-чат</h3>
                <p className="text-sm text-muted-foreground mb-4">Чат с оператором</p>
                <Button variant="outline" size="sm">
                  Начать чат
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <HelpCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Написать</h3>
                <p className="text-sm text-muted-foreground mb-4">Форма обратной связи</p>
                <Button variant="outline" size="sm">
                  Задать вопрос
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 