import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

export interface BackendFieldError {
  field: string
  value: string
  message: string
}

export interface BackendErrorResponse {
  success: boolean
  message: string
  errors?: BackendFieldError[]
}

export interface ArrayFieldMapping {
  field: string
  valueKey: string
}

export function getBackendErrorResponse(
  error: unknown
): BackendErrorResponse | null {
  if (!error) return null

  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: {
        data?: BackendErrorResponse
      }
    }
    const data = axiosError.response?.data
    if (data && isBackendErrorResponse(data)) {
      return data
    }
  }

  if (isBackendErrorResponse(error)) {
    return error
  }

  return null
}

function convertFieldPath(
  field: string,
  arrayFieldMappings?: ArrayFieldMapping[]
): string {
  const arrayMatch = field.match(/^(\w+)\[(\d+)\]$/)

  if (arrayMatch) {
    const [, arrayName, index] = arrayMatch
    const mapping = arrayFieldMappings?.find((m) => m.field === arrayName)
    const valueKey = mapping?.valueKey || 'value'
    return `${arrayName}.${index}.${valueKey}`
  }

  return field
}

export function applyBackendFieldErrors<TFormValues extends FieldValues>(
  form: UseFormReturn<TFormValues>,
  errorOrResponse: unknown,
  arrayFieldMappings?: ArrayFieldMapping[]
): boolean {
  const response = getBackendErrorResponse(errorOrResponse)

  if (!response || !response.errors || response.errors.length === 0) {
    return false
  }

  let hasAppliedError = false

  for (const error of response.errors) {
    const targetField = convertFieldPath(error.field, arrayFieldMappings)

    try {
      form.setError(targetField as Path<TFormValues>, {
        type: 'server',
        message: error.message
      })
      hasAppliedError = true
    } catch {
      console.warn(`Failed to set error for field: ${targetField}`)
    }
  }

  return hasAppliedError
}

export function isBackendErrorResponse(
  response: unknown
): response is BackendErrorResponse {
  if (!response || typeof response !== 'object') {
    return false
  }

  const res = response as Record<string, unknown>
  return (
    typeof res.success === 'boolean' &&
    typeof res.message === 'string' &&
    (!res.errors || Array.isArray(res.errors))
  )
}

export function handleErrorToast(error: unknown, fallbackMessage: string) {
  const response = getBackendErrorResponse(error)
  const errorMessage = response?.message || fallbackMessage
  toast.error(errorMessage)
}
