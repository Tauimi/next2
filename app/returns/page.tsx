import { Metadata } from 'next'
import { RotateCcw, Clock, FileText, CheckCircle, XCircle, AlertTriangle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Возврат товаров - TechnoMart',
  description: 'Условия возврата товаров в TechnoMart. Как вернуть товар, сроки возврата, список невозвратных товаров.',
}

const returnableItems = [
  'Смартфоны и планшеты (если не были в использовании)',
  'Аксессуары в оригинальной упаковке',
  'Бытовая техника без следов эксплуатации',
  'Компьютерное оборудование в заводской упаковке',
  'Телевизоры и мониторы (при сохранении товарного вида)'
]

const nonReturnableItems = [
  'Технически сложные товары надлежащего качества',
  'Товары с нарушенной упаковкой',
  'Товары с признаками использования',
  'Программное обеспечение с нарушенной упаковкой',
  'Товары индивидуального изготовления'
]

const returnReasons = [
  {
    icon: CheckCircle,
    title: 'Товар не подошел',
    description: 'Размер, цвет, модель не соответствует ожиданиям',
    time: '14 дней',
    conditions: 'Товар не должен быть в употреблении'
  },
  {
    icon: XCircle,
    title: 'Товар с браком',
    description: 'Обнаружен производственный дефект',
    time: 'Весь гарантийный период',
    conditions: 'Заключение сервисного центра'
  },
  {
    icon: AlertTriangle,
    title: 'Неполная комплектация',
    description: 'Отсутствуют заявленные аксессуары',
    time: '7 дней',
    conditions: 'При наличии документов о покупке'
  }
]

export default function ReturnsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Возврат <span className="text-primary">товаров</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Простая процедура возврата товаров в соответствии с законодательством РФ
            </p>
          </div>
        </div>
      </section>

      {/* Return Reasons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Основания для возврата</h2>
            <p className="text-xl text-muted-foreground">
              В каких случаях можно вернуть товар
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {returnReasons.map((reason, index) => (
              <div key={index} className="bg-muted/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <reason.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
                <p className="text-muted-foreground mb-4">{reason.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Срок:</span>
                    <span className="text-sm font-medium text-primary">{reason.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {reason.conditions}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как оформить возврат</h2>
            <p className="text-xl text-muted-foreground">
              Пошаговая инструкция по возврату товара
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Обращение',
                  description: 'Свяжитесь с нами по телефону +7 (800) 123-45-67 или через форму на сайте',
                  icon: Phone
                },
                {
                  step: '2',
                  title: 'Оформление',
                  description: 'Получите номер возврата и инструкции по передаче товара',
                  icon: FileText
                },
                {
                  step: '3',
                  title: 'Передача товара',
                  description: 'Принесите товар в наш офис или передайте курьеру',
                  icon: RotateCcw
                },
                {
                  step: '4',
                  title: 'Возврат денег',
                  description: 'Получите деньги в течение 10 рабочих дней',
                  icon: CheckCircle
                }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {process.step}
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <process.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{process.title}</h3>
                  <p className="text-muted-foreground text-sm">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What can be returned */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Returnable Items */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-bold">Можно вернуть</h2>
                </div>
                
                <div className="space-y-3">
                  {returnableItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Условие:</strong> Товар должен быть в оригинальной упаковке, 
                    без следов использования, с сохраненным товарным видом
                  </p>
                </div>
              </div>

              {/* Non-returnable Items */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <h2 className="text-2xl font-bold">Нельзя вернуть</h2>
                </div>
                
                <div className="space-y-3">
                  {nonReturnableItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Примечание:</strong> Технически сложные товары можно вернуть 
                    только при обнаружении недостатков
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Условия возврата</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Сроки возврата</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 14 дней - для товаров надлежащего качества</li>
                  <li>• 7 дней - при неполной комплектации</li>
                  <li>• 15 дней - для технически сложных товаров с недостатками</li>
                  <li>• Весь гарантийный период - при существенных недостатках</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Необходимые документы</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Кассовый или товарный чек</li>
                  <li>• Гарантийный талон</li>
                  <li>• Паспорт покупателя</li>
                  <li>• Заявление на возврат (заполняется у нас)</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Важно знать</h3>
                  <ul className="space-y-1 text-sm text-amber-700">
                    <li>• Возврат денег осуществляется тем же способом, которым была произведена оплата</li>
                    <li>• При возврате товара, купленного в кредит, средства поступают на счет банка</li>
                    <li>• Доставка товара для возврата осуществляется за счет покупателя</li>
                    <li>• При возврате товара надлежащего качества возвращается полная стоимость товара</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Returns */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Нужно оформить возврат?</h2>
            <p className="text-xl mb-8 opacity-90">
              Свяжитесь с нами, и мы поможем оформить возврат быстро и без проблем
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Phone className="mr-2 w-5 h-5" />
                +7 (800) 123-45-67
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Заполнить заявку
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 