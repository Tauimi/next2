'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Settings, 
  Bell, CreditCard, Package, Heart, Save, X, Check 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

interface UserProfile {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  createdAt: Date | string
  isAdmin: boolean
}

interface EditableField {
  label: string
  value: string
  field: keyof UserProfile
  type?: 'text' | 'email' | 'tel'
  editable: boolean
}

const quickActions = [
  {
    title: 'Заказы',
    description: 'Посмотреть историю заказов',
    icon: Package,
    href: '/orders',
    count: 0
  },
  {
    title: 'Избранное',
    description: 'Сохраненные товары',
    icon: Heart,
    href: '/wishlist',
    count: 0
  },
  {
    title: 'Корзина',
    description: 'Товары в корзине',
    icon: CreditCard,
    href: '/cart',
    count: 0
  },
  {
    title: 'Уведомления',
    description: 'Настройки уведомлений',
    icon: Bell,
    href: '/profile/notifications',
    count: 0
  }
]

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const toast = useToast()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<UserProfile>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/profile')
      return
    }
    
    // Инициализируем профиль данными из auth store
    setProfile({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: '', // TODO: добавить в модель пользователя
      createdAt: user.createdAt,
      isAdmin: user.isAdmin
    })
  }, [user, router])

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    )
  }

  const startEditing = (field: string) => {
    setEditingField(field)
    setEditValues({
      ...editValues,
      [field]: profile[field as keyof UserProfile] || ''
    })
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditValues({})
  }

  const saveField = async (field: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: editValues[field as keyof typeof editValues] })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка обновления профиля')
      }

      if (result.success) {
        // Обновляем локальный профиль
        setProfile(result.data)
        
        // Обновляем auth store для основных полей
        if (field === 'firstName' || field === 'lastName' || field === 'phone') {
          setUser({
            ...user!,
            [field]: result.data[field]
          })
        }

        toast.success('Данные успешно обновлены')
        setEditingField(null)
        setEditValues({})
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при сохранении данных'
      setMessage('❌ ' + errorMessage)
      toast.error(errorMessage)
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const profileSections: Array<{
    title: string
    icon: any
    fields: EditableField[]
  }> = [
    {
      title: 'Личная информация',
      icon: User,
      fields: [
        { 
          label: 'Имя', 
          value: profile.firstName || 'Не указано', 
          field: 'firstName', 
          type: 'text',
          editable: true 
        },
        { 
          label: 'Фамилия', 
          value: profile.lastName || 'Не указано', 
          field: 'lastName', 
          type: 'text',
          editable: true 
        },
        { 
          label: 'Email', 
          value: profile.email, 
          field: 'email', 
          type: 'email',
          editable: true 
        },
        { 
          label: 'Телефон', 
          value: profile.phone || 'Не указан', 
          field: 'phone', 
          type: 'tel',
          editable: true 
        }
      ]
    },
    {
      title: 'Адрес доставки',
      icon: MapPin,
      fields: [
        { 
          label: 'Основной адрес', 
          value: profile.address || 'Не указан', 
          field: 'address', 
          type: 'text',
          editable: true 
        }
      ]
    },
    {
      title: 'Аккаунт',
      icon: Shield,
      fields: [
        { 
          label: 'Логин', 
          value: profile.username, 
          field: 'username', 
          editable: false 
        },
        { 
          label: 'Дата регистрации', 
          value: formatDate(new Date(profile.createdAt)), 
          field: 'createdAt', 
          editable: false 
        },
        { 
          label: 'Статус', 
          value: profile.isAdmin ? 'Администратор' : 'Пользователь', 
          field: 'isAdmin', 
          editable: false 
        }
      ]
    }
  ]

  const getFullName = () => {
    const firstName = profile.firstName || ''
    const lastName = profile.lastName || ''
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : profile.username
  }

  const getInitials = () => {
    const firstName = profile.firstName || ''
    const lastName = profile.lastName || ''
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return profile.username.slice(0, 2).toUpperCase()
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {message && (
              <div className="mb-6 p-4 bg-white rounded-lg border">
                <p className="text-sm">{message}</p>
              </div>
            )}
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {getInitials()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Добро пожаловать, {getFullName()}!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Управляйте своим профилем и заказами
                </p>
                {profile.isAdmin && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Администратор
                    </span>
              </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                {profileSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-white rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <section.icon className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">{section.title}</h2>
                    </div>

                    <div className="space-y-4">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex items-center justify-between py-3 border-b border-muted/50 last:border-0">
                          <div className="font-medium text-muted-foreground min-w-[120px]">
                            {field.label}
                          </div>
                          
                          <div className="flex items-center gap-3 flex-1 justify-end">
                            {editingField === field.field ? (
                              <div className="flex items-center gap-2 flex-1 max-w-sm">
                                <Input
                                  type={field.type || 'text'}
                                  value={String(editValues[field.field] || '')}
                                  onChange={(e) => setEditValues({
                                    ...editValues,
                                    [field.field]: e.target.value
                                  })}
                                  className="flex-1"
                                  placeholder={field.label}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveField(field.field)}
                                  disabled={loading}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditing}
                                  disabled={loading}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="text-right flex-1 max-w-sm">
                                  {field.value}
                            </div>
                                {field.editable && (
                                  <button
                                    onClick={() => startEditing(field.field)}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Password Change - пока закомментируем, так как нет API */}
                {/* <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Безопасность</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Текущий пароль</label>
                      <Input type="password" placeholder="Введите текущий пароль" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Новый пароль</label>
                      <Input type="password" placeholder="Введите новый пароль" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
                      <Input type="password" placeholder="Повторите новый пароль" />
                    </div>
                    <Button className="w-full">
                      Изменить пароль
                    </Button>
                  </div>
                </div> */}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Быстрые действия</h3>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        href={action.href}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <action.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {action.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {action.description}
                            </div>
                          </div>
                        </div>
                        {action.count > 0 && (
                          <div className="text-sm font-medium text-primary">
                            {action.count}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Admin Panel Link */}
                {profile.isAdmin && (
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Админ-панель</h3>
                      <Settings className="w-6 h-6" />
                    </div>
                    <p className="text-sm opacity-90 mb-4">
                      Управление товарами, категориями и заказами
                    </p>
                    <Button 
                      asChild 
                      variant="secondary" 
                      className="w-full bg-white text-primary hover:bg-gray-100"
                    >
                      <Link href="/admin">
                        Перейти в админ-панель
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Support */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Нужна помощь?</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Позвонить в поддержку
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Написать сообщение
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 