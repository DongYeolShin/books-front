import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const fetchBooks = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.BOOKS)
  return data
}

export const fetchBookById = async (id) => {
  const { data } = await axiosInstance.get(`${ENDPOINTS.BOOKS}/${id}`)
  return data
}
