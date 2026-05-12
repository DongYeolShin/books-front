import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const addCart = async ({ bookId, quantity = 1 }) => {
  const { data } = await axiosInstance.post(ENDPOINTS.CARTS, {
    bookId,
    quantity,
  })
  return data
}

export const fetchCarts = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.CARTS)
  return data
}

export const updateCart = async ({ bookId, quantity }) => {
  const { data } = await axiosInstance.patch(ENDPOINTS.CARTS, {
    bookId,
    quantity,
  })
  return data
}

export const removeCart = async (bookId) => {
  const { data } = await axiosInstance.delete(ENDPOINTS.CART_DETAIL(bookId))
  return data
}
