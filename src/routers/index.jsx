import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../pages/Layout'
import MainPage from '../pages/MainPage'
import BookListPage from '../pages/BookListPage'
import BookDetailPage from '../pages/BookDetailPage'
import CartPage from '../pages/CartPage'
import OrderPage from '../pages/OrderPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import RequireAuth from './RequireAuth'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'books', element: <Navigate to="/books/bestseller" replace /> },
      { path: 'books/:category', element: <BookListPage /> },
      { path: 'book/:bookId', element: <BookDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      {
        path: 'order',
        element: (
          <RequireAuth>
            <OrderPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
