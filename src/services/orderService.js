import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const fetchOrderBooks = async (orderBookIds) => {
  const { data } = await axiosInstance.get(ENDPOINTS.BOOKS, {
    params: { 'order-books': orderBookIds },
  })
  return data
}
