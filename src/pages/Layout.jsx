import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © 2026 BookStore. All rights reserved.
      </footer>
    </div>
  )
}

export default Layout
