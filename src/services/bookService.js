import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const fetchBooks = async ({
  category,
  page = 1,
  size = 10,
  keyword,
} = {}) => {
  const params = {}
  if (category) params.category = category
  if (page) params.page = page
  if (size) params.size = size
  if (keyword) params.keyword = keyword
  const { data } = await axiosInstance.get(ENDPOINTS.BOOKS, { params })
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
