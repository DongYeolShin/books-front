import { NavLink, Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import styles from './Header.module.css'

const menus = [
  { to: '/', label: 'Home', end: true },
  { to: '/books?category=bestseller', label: '베스트 셀러' },
  { to: '/books?category=new', label: '새로운책' },
  { to: '/books?category=basic', label: '기본서' },
  { to: '/books?category=mobile', label: '모바일' },
  { to: '/books?category=web', label: '웹프로그래밍' },
]

function Header() {
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
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold rounded-lg px-6 py-2.5 transition-colors"
        >
          로그인
        </Link>
      </div>
    </header>
  )
}

export default Header
