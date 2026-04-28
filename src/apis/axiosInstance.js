import axios from 'axios'
import useAuthStore from '../stores/authStore'

const axiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken, tokenType } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `${tokenType || 'Bearer'} ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default axiosInstance
