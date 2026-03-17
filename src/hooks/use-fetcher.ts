import type { BaseResponse } from '@/types/base-response'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

type Service<P extends unknown[], T> = (...args: P) => Promise<BaseResponse<T>>

type UseFetcherOptions<T, P extends unknown[]> = {
  immediate?: boolean
  immediateArgs?: P
  onSuccess?: (message?: string, res?: BaseResponse<T>) => void
  onError?: (message?: string, error?: unknown) => void
  maxRetries?: number
  retryDelayMs?: number
}

export function useFetcher<T, P extends unknown[] = unknown[]>(
  service: Service<P, T>,
  options?: UseFetcherOptions<T, P>
) {
  const {
    immediate = true,
    immediateArgs,
    onSuccess: onSuccessOpt,
    onError: onErrorOpt,
    maxRetries = 2,
    retryDelayMs = 3000
  } = options || {}

  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(immediate)
  const [error, setError] = useState<unknown>(undefined)

  const onSuccessRef = useRef<
    ((message?: string, res?: BaseResponse<T>) => void) | undefined
  >(onSuccessOpt)
  const onErrorRef = useRef<
    ((message?: string, error?: unknown) => void) | undefined
  >(onErrorOpt)

  useEffect(() => {
    onSuccessRef.current = onSuccessOpt
  }, [onSuccessOpt])

  useEffect(() => {
    onErrorRef.current = onErrorOpt
  }, [onErrorOpt])

  const initialRun = useCallback(
    async (...args: P): Promise<BaseResponse<T> | void> => {
      let attempt = 0
      const maxAttempt = Math.max(0, Math.floor(maxRetries))

      while (true) {
        try {
          const res = await service(...args)
          setData(res.data as T | undefined)
          setIsLoading(false)

          try {
            onSuccessRef.current?.(res.message, res)
          } catch (cbErr) {
            console.error('useFetcher onSuccess callback error', cbErr)
          }

          return res
        } catch (err) {
          attempt += 1

          const isLastAttempt = attempt > maxAttempt

          if (isLastAttempt) {
            setIsLoading(false)
            setError(err)

            let message: string | undefined
            try {
              const anyErr = err as {
                response?: { data?: { message?: string } }
                message?: string
              }
              message = anyErr?.response?.data?.message || anyErr?.message
            } catch {
              console.error('Failed to extract error message')
            }

            try {
              onErrorRef.current?.(message, err)
            } catch (cbErr) {
              console.error('useFetcher onError callback error', cbErr)
            }

            return
          }

          if (retryDelayMs && retryDelayMs > 0) {
            await new Promise((r) => setTimeout(r, retryDelayMs))
          }
        }
      }
    },
    [service, maxRetries, retryDelayMs]
  )

  const run = useCallback(
    async (...args: P): Promise<BaseResponse<T> | void> => {
      setIsLoading(true)
      setError(undefined)

      let attempt = 0
      const maxAttempt = Math.max(0, Math.floor(maxRetries))

      while (true) {
        try {
          const res = await service(...args)
          setData(res.data as T | undefined)
          setIsLoading(false)

          try {
            onSuccessRef.current?.(res.message, res)
          } catch (cbErr) {
            console.error('useFetcher onSuccess callback error', cbErr)
          }

          return res
        } catch (err) {
          attempt += 1

          const isLastAttempt = attempt > maxAttempt

          if (isLastAttempt) {
            setIsLoading(false)
            setError(err)

            let message: string | undefined
            try {
              const anyErr = err as {
                response?: { data?: { message?: string } }
                message?: string
              }
              message = anyErr?.response?.data?.message || anyErr?.message
            } catch {
              console.error('Failed to extract error message')
            }

            try {
              onErrorRef.current?.(message, err)
            } catch (cbErr) {
              console.error('useFetcher onError callback error', cbErr)
            }

            return
          }

          if (retryDelayMs && retryDelayMs > 0) {
            await new Promise((r) => setTimeout(r, retryDelayMs))
          }
        }
      }
    },
    [service, maxRetries, retryDelayMs]
  )

  const onSuccess = useCallback((message?: string, res?: BaseResponse<T>) => {
    try {
      onSuccessRef.current?.(message, res)
    } catch (e) {
      console.error('useFetcher onSuccess manual callback error', e)
    }
  }, [])

  const onError = useCallback((message?: string, err?: unknown) => {
    try {
      onErrorRef.current?.(message, err)
    } catch (e) {
      console.error('useFetcher onError manual callback error', e)
    }
  }, [])

  const reset = useCallback(() => {
    setData(undefined)
    setError(undefined)
    setIsLoading(false)
  }, [])

  useLayoutEffect(() => {
    if (immediate) {
      setTimeout(() => {
        if (immediateArgs && immediateArgs.length > 0) {
          void initialRun(...immediateArgs)
        } else {
          // call with an empty tuple cast to P for cases where P may be []
          void initialRun(...([] as unknown as P))
        }
      }, 0)
    }
  }, [immediate, immediateArgs, initialRun])

  return {
    data,
    isLoading,
    error,
    run,
    reset,
    onSuccess,
    onError
  }
}

export default useFetcher
