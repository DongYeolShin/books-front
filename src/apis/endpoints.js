export const ENDPOINTS = {
  BOOKS: '/books',
  BOOKS_TOPN: '/books/topn',
  BOOK_DETAIL: (bookId) => `/books/${bookId}`,
  USERS: '/users',
  LOGIN: '/login',
  CARTS: '/carts',
  CART_DETAIL: (bookId) => `/carts/${bookId}`,
  ORDERS: '/orders',
  PAYMENTS_COMPLETE: '/payments/complete',
  USER_ME: '/users/me',
}
