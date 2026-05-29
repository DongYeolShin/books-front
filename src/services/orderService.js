import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const fetchOrderBooks = async (orderBookIds) => {
  const { data } = await axiosInstance.get(ENDPOINTS.BOOKS, {
    params: { 'order-books': orderBookIds },
  })
  return data
}

export const fetchMyOrders = async (page = 1) => {
  try {
    const { data } = await axiosInstance.get(ENDPOINTS.ORDERS, {
      params: { page },
    })
    return data
  } catch (e) {
    const res = await fetch('/mocks/orders-list.json')
    if (!res.ok) throw e
    return res.json()
  }
}
