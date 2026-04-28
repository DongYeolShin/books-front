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
