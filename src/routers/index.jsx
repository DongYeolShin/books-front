import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import MainPage from '../pages/MainPage'
import BooksPage from '../pages/BooksPage'
import BookDetailPage from '../pages/BookDetailPage'
import CartPage from '../pages/CartPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'

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
      { path: 'books', element: <BooksPage /> },
      { path: 'books/:bookId', element: <BookDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
