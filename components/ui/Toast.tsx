'use client'

import toast, { Toaster, ToastBar } from 'react-hot-toast'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Экспорт функций для использования в компонентах
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message, { icon: '💡' }),
  warning: (message: string) => toast(message, { icon: '⚠️' }),
  loading: (message: string) => toast.loading(message),
  promise: (
    promise: Promise<any>,
    msgs: {
      loading: string
      success: string
      error: string
    }
  ) => toast.promise(promise, msgs)
}

// Компонент Toast Provider
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Настройки по умолчанию
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '500px',
        },
        // Настройки для разных типов
        success: {
          duration: 4000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 6000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        loading: {
          style: {
            background: '#3b82f6',
            color: '#fff',
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-center gap-3">
              {icon}
              <div className="flex-1">
                {message}
              </div>
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="ml-3 p-1 rounded-full hover:bg-black/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

// Хук для упрощенного использования
export function useToast() {
  return {
    success: (message: string) => {
      toast.success(message, {
        icon: <CheckCircle className="h-5 w-5" />,
      })
    },
    error: (message: string) => {
      toast.error(message, {
        icon: <AlertCircle className="h-5 w-5" />,
      })
    },
    info: (message: string) => {
      toast(message, {
        icon: <Info className="h-5 w-5 text-blue-500" />,
        style: {
          background: '#3b82f6',
          color: '#fff',
        },
      })
    },
    warning: (message: string) => {
      toast(message, {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        style: {
          background: '#f59e0b',
          color: '#fff',
        },
      })
    },
    loading: (message: string) => {
      return toast.loading(message)
    },
    dismiss: (toastId?: string) => {
      toast.dismiss(toastId)
    },
    promise: (
      promise: Promise<any>,
      msgs: {
        loading: string
        success: string
        error: string
      }
    ) => {
      return toast.promise(promise, msgs)
    }
  }
} 