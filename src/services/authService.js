import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const login = async ({ userId, passwd }) => {
  const params = new URLSearchParams()
  params.append('userId', userId)
  params.append('passwd', passwd)

  const { data } = await axiosInstance.post(ENDPOINTS.LOGIN, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  return data
}

export const signup = async (payload) => {
  const { data } = await axiosInstance.post(ENDPOINTS.USER_SIGNUP, payload)
  return data
}

export const checkUserId = async (userId) => {
  const { data } = await axiosInstance.get(ENDPOINTS.USER_CHECK_ID, {
    params: { userId },
  })
  return data
}
