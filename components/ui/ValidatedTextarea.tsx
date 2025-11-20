'use client'

import { TextareaHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ValidationResult, validateField, ValidationRule } from '@/lib/validation'
import { AlertCircle } from 'lucide-react'

export interface ValidatedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  validationRules?: ValidationRule
  onValidationChange?: (result: ValidationResult) => void
  onChange?: (value: string) => void
  showErrorOnBlur?: boolean
  showCharCount?: boolean
}

const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ 
    className, 
    label, 
    error: externalError, 
    validationRules,
    onValidationChange,
    onChange,
    showErrorOnBlur = true,
    showCharCount = false,
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    const charCount = value.length
    const maxLength = validationRules?.maxLength || props.maxLength

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
            {validationRules?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm',
              'placeholder:text-secondary-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors resize-none',
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
        </div>
        <div className="flex items-center justify-between mt-1">
          {error ? (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          ) : (
            <div />
          )}
          {showCharCount && maxLength && (
            <p className={cn(
              'text-xs',
              charCount > maxLength ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

ValidatedTextarea.displayName = 'ValidatedTextarea'

export { ValidatedTextarea }
