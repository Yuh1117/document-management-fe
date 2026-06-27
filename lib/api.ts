import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { endpoints } from '@/lib/endpoints'

export { endpoints }

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const LANGUAGE_STORAGE_KEY = 'language'

export function getAcceptLanguage(): string {
  if (typeof window === 'undefined') return 'vi'
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'vi'
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const isRefreshRequest = config.url?.includes(endpoints['refresh'])
  if (!isRefreshRequest) {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  config.headers['Accept-Language'] = getAcceptLanguage()
  config.headers['ngrok-skip-browser-warning'] = 'true'
  return config
})

let isRefreshing = false
let refreshSubscribers: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = []

const notifySubscribers = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token))
  refreshSubscribers = []
}

const rejectSubscribers = (err: unknown) => {
  refreshSubscribers.forEach(({ reject }) => reject(err))
  refreshSubscribers = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isUnauthorized = error.response?.status === 401
    const isRefreshEndpoint = originalRequest.url?.includes(endpoints['refresh'])
    const isPublicEndpoint = [
      endpoints['login'],
      endpoints['signup'],
      endpoints['google-login'],
    ].some((url) => originalRequest.url?.includes(url))
    const hasRetried = originalRequest._retry

    if (!isUnauthorized || isRefreshEndpoint || isPublicEndpoint || hasRetried) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push({
          resolve: (token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const res = await axios.post(
        BASE_URL + endpoints['refresh'],
        {},
        {
          withCredentials: true,
          headers: { 'Accept-Language': getAcceptLanguage(), 'ngrok-skip-browser-warning': 'true' },
        }
      )
      const newToken = res.data.data.accessToken
      useAuthStore.getState().setAccessToken(newToken)
      notifySubscribers(newToken)
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      return api(originalRequest)
    } catch (refreshError) {
      rejectSubscribers(refreshError)
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
