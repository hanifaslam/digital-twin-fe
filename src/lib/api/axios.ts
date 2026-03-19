import { BaseResponse } from '@/types/base-response'
import { BProgress } from '@bprogress/core'
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { toast } from 'sonner'
import { authEvents } from '../auth-event'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  withCredentials: true
})

const isCsrfDisabled = process.env.NEXT_PUBLIC_DISABLE_CSRF === 'true'

let csrfToken: string | null = null

async function fetchCsrfToken() {
  const res = await axiosInstance.get<{ csrfToken: string }>('/auth/csrf-token')
  csrfToken = res.data.csrfToken
  return csrfToken
}

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    BProgress.start()
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/')
      const locale = pathParts[1]
      if (['en', 'id'].includes(locale)) {
        config.headers['Accept-Language'] = locale
      }
    }

    if (
      !isCsrfDisabled &&
      config.method &&
      ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())
    ) {
      if (!csrfToken) {
        await fetchCsrfToken()
      }
      if (csrfToken) {
        const headers = new AxiosHeaders()
        if (config.headers) {
          const existing = config.headers as Record<string, unknown>
          for (const [key, value] of Object.entries(existing)) {
            if (value === undefined) continue
            if (Array.isArray(value)) {
              headers.set(
                key,
                value.map((v) => String(v))
              )
            } else {
              headers.set(key, String(value))
            }
          }
        }
        headers.set('X-CSRF-Token', csrfToken)
        config.headers = headers
      }
    }

    return config
  },
  (error: AxiosError) => {
    BProgress.done()
    return Promise.reject(error)
  }
)

let isRefreshing = false
let failedQueue: {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}[] = []

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    BProgress.done()
    return response
  },
  async (error: AxiosError) => {
    BProgress.done()
    const status = error.response?.status
    const data = error.response?.data as { message?: string } | undefined
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
      _retry_csrf?: boolean
    }

    if (
      !isCsrfDisabled &&
      ((status === 403 &&
        data?.message?.toLowerCase().includes('invalid csrf token')) ||
        (data?.message?.toLowerCase().includes('token csrf tidak valid') &&
          originalRequest))
    ) {
      if (!originalRequest._retry_csrf) {
        originalRequest._retry_csrf = true
        try {
          await fetchCsrfToken()
          return axiosInstance.request(originalRequest)
        } catch (e) {
          return Promise.reject(e)
        }
      }
    }

    if (status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('auth/login') ||
        originalRequest.url?.includes('auth/refresh')
      ) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axiosInstance.post('/auth/refresh')
        processQueue(null)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)
        localStorage.removeItem('auth-data')
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/login')
        ) {
          toast.error('Session has expired. Please log in again.')
          authEvents.emitUnauthorized()
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

async function request<T = unknown, D = unknown>(
  config: AxiosRequestConfig<D>
): Promise<BaseResponse<T>> {
  const res = await axiosInstance.request<
    BaseResponse<T>,
    AxiosResponse<BaseResponse<T>>,
    D
  >(config)
  return res.data
}

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),
  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) => request<T, D>({ ...config, method: 'POST', url, data }),
  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) => request<T, D>({ ...config, method: 'PUT', url, data }),
  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) => request<T, D>({ ...config, method: 'PATCH', url, data }),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
  request: <T = unknown, D = unknown>(config: AxiosRequestConfig<D>) =>
    request<T, D>(config)
}

export default axiosInstance
