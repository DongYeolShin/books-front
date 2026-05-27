import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { BookOpen, ChevronDown } from 'lucide-react'
import styles from './Header.module.css'
import useAuthStore, { selectIsAuthenticated } from '../stores/authStore'

const menus = [
  { to: '/', label: 'Home', end: true },
  { to: '/books/bestseller', label: '베스트 셀러' },
  { to: '/books/new', label: '새로운책' },
  { to: '/books/basic', label: '기본서' },
  { to: '/books/mobile', label: '모바일' },
  { to: '/books/web', label: '웹프로그래밍' },
]

function Header() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const name = useAuthStore((state) => state.name)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  const handleLogout = () => {
    clearAuth()
    setIsOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <header className={`${styles.header} bg-white sticky top-0 z-10`}>
      <div className="h-16 px-10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <BookOpen className="text-blue-600" size={28} strokeWidth={2} />
            <span className={`${styles.logoText} text-xl font-bold text-gray-800`}>
              북스토어
            </span>
          </Link>
          <nav className="flex items-center gap-7">
            {menus.map((menu) => (
              <NavLink
                key={menu.label}
                to={menu.to}
                end={menu.end}
                className={({ isActive }) =>
                  `${styles.navLink} text-[15px] font-medium text-gray-700 ${
                    isActive ? styles.activeLink : ''
                  }`
                }
              >
                {menu.label}
              </NavLink>
            ))}
          </nav>
        </div>
        {isAuthenticated ? (
          <div ref={wrapperRef} className={styles.dropdownWrapper}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isOpen}
              className="flex items-center gap-1 text-[15px] font-semibold text-gray-700"
            >
              {name}님
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className={styles.dropdownMenu} role="menu">
                <Link
                  to="/cart"
                  role="menuitem"
                  className={styles.dropdownItem}
                  onClick={() => setIsOpen(false)}
                >
                  장바구니
                </Link>
                <Link
                  to="/mypage"
                  role="menuitem"
                  className={styles.dropdownItem}
                  onClick={() => setIsOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg px-6 py-2.5 transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
