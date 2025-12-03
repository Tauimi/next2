'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ValidationResult, ValidationRule } from '@/lib/validation'
import { AlertCircle, Check } from 'lucide-react'

export interface ValidatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  validationRules?: ValidationRule
  onValidationChange?: (result: ValidationResult) => void
  onChange?: (value: string) => void
  showSuccessIcon?: boolean
}

function validateValue(value: string, rules?: ValidationRule): ValidationResult {
  if (!rules) return { isValid: true }

  // Проверка обязательности
  if (rules.required && (!value || value.trim() === '')) {
    return { isValid: false, error: rules.message || 'Это поле обязательно' }
  }

  // Если не обязательное и пустое - валидно
  if (!rules.required && (!value || value.trim() === '')) {
    return { isValid: true }
  }

  // Проверка минимальной длины
  if (rules.minLength && value.trim().length < rules.minLength) {
    return { isValid: false, error: rules.message || `Минимум ${rules.minLength} символов` }
  }

  // Проверка максимальной длины
  if (rules.maxLength && value.trim().length > rules.maxLength) {
    return { isValid: false, error: rules.message || `Максимум ${rules.maxLength} символов` }
  }

  // Проверка паттерна
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: rules.message || 'Неверный формат' }
  }

  // Кастомная валидация
  if (rules.custom) {
    const customResult = rules.custom(value)
    if (typeof customResult === 'object' && 'isValid' in customResult) {
      if (!customResult.isValid) {
        return customResult
      }
    } else if (!customResult) {
      return { isValid: false, error: rules.message || 'Значение не прошло проверку' }
    }
  }

  return { isValid: true }
}

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    className, 
    label, 
    error: externalError, 
    validationRules,
    onValidationChange,
    onChange,
    showSuccessIcon = false,
    value: propValue,
    ...props 
  }, ref) => {
    const [touched, setTouched] = useState(false)
    const [internalValue, setInternalValue] = useState(propValue?.toString() || '')
    const [validationError, setValidationError] = useState<string>()

    const value = propValue !== undefined ? propValue.toString() : internalValue
    const showError = touched && (externalError || validationError)
    const isValid = touched && !externalError && !validationError && value.length > 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      
      // Валидируем
      const result = validateValue(newValue, validationRules)
      setValidationError(result.error)
      
      // Уведомляем родителя
      if (onValidationChange) {
        onValidationChange(result)
      }
      
      if (onChange) {
        onChange(newValue)
      }
    }

    const handleBlur = () => {
      setTouched(true)
      // Валидируем при потере фокуса
      const result = validateValue(value, validationRules)
      setValidationError(result.error)
      
      if (onValidationChange) {
        onValidationChange(result)
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
            {validationRules?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm',
              'placeholder:text-secondary-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              showError 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : isValid && showSuccessIcon
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                  : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500/20',
              className
            )}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
          {showError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
          )}
          {isValid && showSuccessIcon && !showError && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
        </div>
        {showError && (
          <p className="mt-1 text-sm text-red-500">
            {externalError || validationError}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'

export { ValidatedInput, validateValue }
