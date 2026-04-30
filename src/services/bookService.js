import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const fetchBooks = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.BOOKS)
  return data
}

export const fetchBookById = async (bookId) => {
  const { data } = await axiosInstance.get(ENDPOINTS.BOOK_DETAIL(bookId))
  return data
}

export const fetchTopBooks = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.BOOKS_TOPN)
  return data
}
