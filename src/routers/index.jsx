import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../pages/Layout'
import MainPage from '../pages/MainPage'
import BookListPage from '../pages/BookListPage'
import BookDetailPage from '../pages/BookDetailPage'
import CartPage from '../pages/CartPage'
import OrderPage from '../pages/OrderPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'
import PaymentFailPage from '../pages/PaymentFailPage'
import OrderCompletePage from '../pages/OrderCompletePage'
import MyPage from '../pages/MyPage'
import RequireAuth from './RequireAuth'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/payment/success',
    element: <PaymentSuccessPage />,
  },
  {
    path: '/payment/fail',
    element: <PaymentFailPage />,
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
      {
        path: 'cart',
        element: (
          <RequireAuth>
            <CartPage />
          </RequireAuth>
        ),
      },
      {
        path: 'order',
        element: (
          <RequireAuth>
            <OrderPage />
          </RequireAuth>
        ),
      },
      {
        path: 'order/complete',
        element: (
          <RequireAuth>
            <OrderCompletePage />
          </RequireAuth>
        ),
      },
      {
        path: 'mypage',
        element: (
          <RequireAuth>
            <MyPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
