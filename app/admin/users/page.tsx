'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Users, Search, Eye, Shield, ShieldOff, Ban, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  phone?: string
  isAdmin: boolean
  isActive: boolean
  createdAt: string
  _count: {
    orders: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const url = searchQuery 
        ? `/api/admin/users?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/users'
      
      const response = await fetch(url)
      const data = await response.json()
      setUsers(data.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user')
      }

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ))
    } catch (error) {
      console.error('Error updating user:', error)
      alert(error instanceof Error ? error.message : 'Ошибка обновления пользователя')
    }
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`${currentStatus ? 'Убрать' : 'Назначить'} права администратора?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !currentStatus })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user')
      }

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isAdmin: !currentStatus }
          : user
      ))
    } catch (error) {
      console.error('Error updating user:', error)
      alert(error instanceof Error ? error.message : 'Ошибка обновления пользователя')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Загрузка пользователей...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Пользователи</h1>
              <p className="text-muted-foreground">
                Всего пользователей: {users.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск по email, имени или username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Найти</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                fetchUsers()
              }}
            >
              Сбросить
            </Button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Пользователь</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Телефон</th>
                  <th className="text-left p-4 font-medium">Заказы</th>
                  <th className="text-left p-4 font-medium">Роль</th>
                  <th className="text-left p-4 font-medium">Статус</th>
                  <th className="text-left p-4 font-medium">Дата регистрации</th>
                  <th className="text-center p-4 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      Пользователи не найдены
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-muted/20">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {user.firstName || user.lastName 
                              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                              : user.username
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{user.phone || '—'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{user._count.orders}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            user.isAdmin
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {user.isAdmin ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Админ
                            </>
                          ) : (
                            <>
                              <ShieldOff className="w-3 h-3 mr-1" />
                              Пользователь
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Активен
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3 mr-1" />
                              Заблокирован
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button size="sm" variant="outline" title="Просмотр">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        {users.length > 0 && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {users.length}
                </div>
                <div className="text-sm text-muted-foreground">Всего пользователей</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Активные</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.isAdmin).length}
                </div>
                <div className="text-sm text-muted-foreground">Администраторы</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {users.reduce((sum, u) => sum + u._count.orders, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Всего заказов</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
