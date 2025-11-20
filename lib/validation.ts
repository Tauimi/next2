// Утилиты для валидации форм

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// Валидация email
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email обязателен для заполнения' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Введите корректный email адрес' }
  }

  return { isValid: true }
}

// Валидация телефона (российский формат)
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Телефон обязателен для заполнения' }
  }

  // Убираем все символы кроме цифр
  const digitsOnly = phone.replace(/\D/g, '')

  // Проверяем что начинается с 7 или 8 и содержит 11 цифр
  if (digitsOnly.length !== 11 || !['7', '8'].includes(digitsOnly[0])) {
    return { isValid: false, error: 'Введите корректный номер телефона (11 цифр)' }
  }

  return { isValid: true }
}

// Валидация имени
export const validateName = (name: string, fieldName: string = 'Имя'): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} обязательно для заполнения` }
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} должно содержать минимум 2 символа` }
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: `${fieldName} не должно превышать 100 символов` }
  }

  // Проверка на наличие хотя бы одной буквы
  if (!/[а-яА-ЯёЁa-zA-Z]/.test(name)) {
    return { isValid: false, error: `${fieldName} должно содержать буквы` }
  }

  return { isValid: true }
}

// Валидация адреса
export const validateAddress = (address: string): ValidationResult => {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Адрес обязателен для заполнения' }
  }

  if (address.trim().length < 5) {
    return { isValid: false, error: 'Адрес должен содержать минимум 5 символов' }
  }

  if (address.trim().length > 200) {
    return { isValid: false, error: 'Адрес не должен превышать 200 символов' }
  }

  return { isValid: true }
}

// Валидация города
export const validateCity = (city: string): ValidationResult => {
  if (!city || city.trim() === '') {
    return { isValid: false, error: 'Город обязателен для заполнения' }
  }

  if (city.trim().length < 2) {
    return { isValid: false, error: 'Название города должно содержать минимум 2 символа' }
  }

  if (!/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(city)) {
    return { isValid: false, error: 'Название города должно содержать только буквы' }
  }

  return { isValid: true }
}

// Валидация почтового индекса
export const validateZipCode = (zipCode: string): ValidationResult => {
  if (!zipCode || zipCode.trim() === '') {
    return { isValid: false, error: 'Почтовый индекс обязателен для заполнения' }
  }

  const digitsOnly = zipCode.replace(/\D/g, '')

  if (digitsOnly.length !== 6) {
    return { isValid: false, error: 'Почтовый индекс должен содержать 6 цифр' }
  }

  return { isValid: true }
}

// Валидация сообщения/комментария
export const validateMessage = (message: string, minLength: number = 10): ValidationResult => {
  if (!message || message.trim() === '') {
    return { isValid: false, error: 'Сообщение обязательно для заполнения' }
  }

  if (message.trim().length < minLength) {
    return { isValid: false, error: `Сообщение должно содержать минимум ${minLength} символов` }
  }

  if (message.trim().length > 1000) {
    return { isValid: false, error: 'Сообщение не должно превышать 1000 символов' }
  }

  return { isValid: true }
}

// Универсальная валидация поля
export const validateField = (
  value: string,
  rules: ValidationRule
): ValidationResult => {
  // Проверка обязательности
  if (rules.required && (!value || value.trim() === '')) {
    return { 
      isValid: false, 
      error: rules.message || 'Это поле обязательно для заполнения' 
    }
  }

  // Если поле не обязательное и пустое - валидно
  if (!rules.required && (!value || value.trim() === '')) {
    return { isValid: true }
  }

  // Проверка минимальной длины
  if (rules.minLength && value.trim().length < rules.minLength) {
    return { 
      isValid: false, 
      error: rules.message || `Минимальная длина ${rules.minLength} символов` 
    }
  }

  // Проверка максимальной длины
  if (rules.maxLength && value.trim().length > rules.maxLength) {
    return { 
      isValid: false, 
      error: rules.message || `Максимальная длина ${rules.maxLength} символов` 
    }
  }

  // Проверка по регулярному выражению
  if (rules.pattern && !rules.pattern.test(value)) {
    return { 
      isValid: false, 
      error: rules.message || 'Неверный формат' 
    }
  }

  // Кастомная валидация
  if (rules.custom && !rules.custom(value)) {
    return { 
      isValid: false, 
      error: rules.message || 'Значение не прошло проверку' 
    }
  }

  return { isValid: true }
}

// Форматирование телефона
export const formatPhone = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '')
  
  if (digitsOnly.length === 0) return ''
  if (digitsOnly.length <= 1) return `+${digitsOnly}`
  if (digitsOnly.length <= 4) return `+${digitsOnly[0]} (${digitsOnly.slice(1)}`
  if (digitsOnly.length <= 7) return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4)}`
  if (digitsOnly.length <= 9) return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`
  
  return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 9)}-${digitsOnly.slice(9, 11)}`
}

// Форматирование почтового индекса
export const formatZipCode = (zipCode: string): string => {
  return zipCode.replace(/\D/g, '').slice(0, 6)
}

// Валидация пароля
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Пароль обязателен для заполнения' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Пароль должен содержать минимум 8 символов' }
  }

  if (password.length > 100) {
    return { isValid: false, error: 'Пароль не должен превышать 100 символов' }
  }

  // Проверка на наличие хотя бы одной цифры
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Пароль должен содержать хотя бы одну цифру' }
  }

  // Проверка на наличие хотя бы одной буквы
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: 'Пароль должен содержать хотя бы одну букву' }
  }

  return { isValid: true }
}

// Валидация подтверждения пароля
export const validatePasswordConfirm = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'Подтвердите пароль' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Пароли не совпадают' }
  }

  return { isValid: true }
}

// Валидация username
export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Логин обязателен для заполнения' }
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Логин должен содержать минимум 3 символа' }
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Логин не должен превышать 20 символов' }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Логин может содержать только латинские буквы, цифры и _' }
  }

  return { isValid: true }
}
