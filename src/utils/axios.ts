import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // build uses localhost for some reason
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://test.payplan.zerolafrica.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor
let isRefreshing = false
type PromiseQueueItem = {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}
let failedQueue: PromiseQueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    // AxiosError does not contain _retry, need intersection or custom type
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return instance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      // We need to import useAuthStore dynamically to avoid circular dependency if possible,
      // or just rely on the store having been initialized.
      // Importing outside function is fine if pinia is active.
      // Since useAuthStore is already imported at the top, we can use it directly.
      const authStore = useAuthStore()

      try {
        const newToken = await authStore.refreshAccessToken()
        processQueue(null, newToken)
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken
        return instance(originalRequest)
      } catch (err) {
        processQueue(err, null)

        // Prevent redirect loop on signup page
        const isSignupPage = window.location.pathname.includes('/signup')

        if (!isSignupPage) {
          // Force logout
          authStore.logout()
          window.location.href = '/login'
        }

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default instance
