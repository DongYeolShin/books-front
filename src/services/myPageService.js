import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const fetchMyPageProfile = async (userId) => {
  try {
    const { data } = await axiosInstance.get(ENDPOINTS.USER_PROFILE(userId))
    return data
  } catch (e) {
    const res = await fetch('/mocks/mypage-profile.json')
    if (!res.ok) throw e
    return res.json()
  }
}
