import { Metadata } from 'next'
import { Shield, Eye, Database, Settings, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности - TechnoMart',
  description: 'Политика конфиденциальности TechnoMart. Как мы собираем, используем и защищаем ваши персональные данные.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Политика <span className="text-primary">конфиденциальности</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Мы серьезно относимся к защите ваших персональных данных
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Безопасность</h3>
                <p className="text-sm text-muted-foreground">Надежная защита данных</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Прозрачность</h3>
                <p className="text-sm text-muted-foreground">Понятные условия</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Минимизация</h3>
                <p className="text-sm text-muted-foreground">Только необходимые данные</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Контроль</h3>
                <p className="text-sm text-muted-foreground">Ваши права</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-muted/50 p-6 rounded-lg mb-8">
                <p className="text-sm text-muted-foreground mb-0">
                  <strong>Дата вступления в силу:</strong> 1 января 2024 года<br/>
                  <strong>Последнее обновление:</strong> 15 января 2024 года
                </p>
              </div>

              <h2>1. Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности (далее — «Политика») описывает, как ООО «ТехноМарт» 
                (далее — «мы», «нас», «наш», «Компания») собирает, использует, хранит и защищает 
                персональные данные пользователей нашего веб-сайта technomart.ru и мобильных приложений.
              </p>

              <h2>2. Какую информацию мы собираем</h2>
              <h3>2.1. Личная информация</h3>
              <ul>
                <li>Имя, фамилия, отчество</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Адрес доставки</li>
                <li>Платежная информация (через защищенные платежные системы)</li>
              </ul>

              <h3>2.2. Техническая информация</h3>
              <ul>
                <li>IP-адрес</li>
                <li>Информация о браузере и устройстве</li>
                <li>Данные о посещениях сайта</li>
                <li>Файлы cookie и аналогичные технологии</li>
              </ul>

              <h2>3. Как мы используем информацию</h2>
              <p>Мы используем собранную информацию для:</p>
              <ul>
                <li>Обработки и выполнения заказов</li>
                <li>Предоставления клиентской поддержки</li>
                <li>Улучшения наших услуг и веб-сайта</li>
                <li>Отправки важных уведомлений о заказах</li>
                <li>Проведения маркетинговых активностей (с вашего согласия)</li>
                <li>Соблюдения правовых обязательств</li>
              </ul>

              <h2>4. Передача данных третьим лицам</h2>
              <p>Мы можем передавать ваши данные:</p>
              <ul>
                <li><strong>Службам доставки</strong> — для доставки заказов</li>
                <li><strong>Платежным системам</strong> — для обработки платежей</li>
                <li><strong>Государственным органам</strong> — при наличии законных требований</li>
                <li><strong>Партнерам</strong> — только с вашего явного согласия</li>
              </ul>
              <p>Мы никогда не продаем ваши персональные данные третьим лицам.</p>

              <h2>5. Защита данных</h2>
              <p>Для защиты ваших данных мы применяем:</p>
              <ul>
                <li>SSL-шифрование для передачи данных</li>
                <li>Многоуровневую систему безопасности</li>
                <li>Регулярные аудиты безопасности</li>
                <li>Ограниченный доступ сотрудников к данным</li>
                <li>Современные методы шифрования для хранения</li>
              </ul>

              <h2>6. Файлы cookie</h2>
              <p>
                Мы используем файлы cookie для улучшения работы сайта. Вы можете управлять 
                настройками cookie в браузере. Некоторые функции сайта могут работать некорректно 
                при отключении cookie.
              </p>

              <h2>7. Ваши права</h2>
              <p>В соответствии с законодательством вы имеете право:</p>
              <ul>
                <li>Получать информацию о ваших данных</li>
                <li>Исправлять неточные данные</li>
                <li>Удалять ваши данные</li>
                <li>Ограничивать обработку данных</li>
                <li>Переносить данные</li>
                <li>Отзывать согласие на обработку</li>
              </ul>

              <h2>8. Хранение данных</h2>
              <p>
                Мы храним ваши данные только в течение необходимого периода:
              </p>
              <ul>
                <li>Данные заказов — 5 лет (для налогового учета)</li>
                <li>Маркетинговые данные — до отзыва согласия</li>
                <li>Технические логи — 1 год</li>
                <li>Данные аккаунта — до удаления аккаунта</li>
              </ul>

              <h2>9. Дети</h2>
              <p>
                Наши услуги предназначены для лиц старше 18 лет. Мы сознательно не собираем 
                данные детей младше 14 лет без согласия родителей.
              </p>

              <h2>10. Международные передачи</h2>
              <p>
                Ваши данные обрабатываются на территории Российской Федерации. При передаче 
                данных в другие страны мы обеспечиваем соответствующий уровень защиты.
              </p>

              <h2>11. Изменения в политике</h2>
              <p>
                Мы можем обновлять эту Политику. О существенных изменениях мы уведомим вас 
                по электронной почте или через уведомления на сайте.
              </p>

              <h2>12. Контактная информация</h2>
              <p>По вопросам обработки персональных данных обращайтесь:</p>
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-sm text-muted-foreground">privacy@technomart.ru</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Телефон</div>
                      <div className="text-sm text-muted-foreground">+7 (800) 123-45-67</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <strong>Адрес:</strong> 123456, г. Москва, ул. Тверская, д. 15, офис 501<br/>
                  <strong>ИНН:</strong> 1234567890<br/>
                  <strong>ОГРН:</strong> 1234567890123
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 