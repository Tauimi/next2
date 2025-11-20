'use client'

import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ValidationResult, validateField, ValidationRule } from '@/lib/validation'
import { AlertCircle } from 'lucide-react'

export interface ValidatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  validationRules?: ValidationRule
  onValidationChange?: (result: ValidationResult) => void
  onChange?: (value: string) => void
  showErrorOnBlur?: boolean
}

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    className, 
    label, 
    error: externalError, 
    validationRules,
    onValidationChange,
    onChange,
    showErrorOnBlur = true,
    ...props 
  }, ref) => {
    const [internalError, setInternalError] = useState<string>()
    const [touched, setTouched] = useState(false)
    const [value, setValue] = useState(props.value?.toString() || '')

    const error = externalError || (touched && internalError)

    const validate = (val: string) => {
      if (!validationRules) return { isValid: true }

      const result = validateField(val, validationRules)
      setInternalError(result.error)
      
      if (onValidationChange) {
        onValidationChange(result)
      }

      return result
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      
      if (onChange) {
        onChange(newValue)
      }

      // Валидируем только если поле уже было touched
      if (touched) {
        validate(newValue)
      }
    }

    const handleBlur = () => {
      setTouched(true)
      if (showErrorOnBlur) {
        validate(value)
      }
    }

    useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value.toString())
      }
    }, [props.value])

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
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500/20',
              className
            )}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'

export { ValidatedInput }
