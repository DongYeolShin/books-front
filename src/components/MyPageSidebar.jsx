import { Link, useNavigate } from 'react-router-dom'
import { User, Package, ShoppingCart, LogOut } from 'lucide-react'
import useAuthStore from '../stores/authStore'

const MENU_ITEMS = [
  { key: 'profile', label: '내 정보', to: '/mypage', icon: User },
  { key: 'orders', label: '주문/배송목록', to: '/mypage/orders', icon: Package },
  { key: 'cart', label: '장바구니', to: '/cart', icon: ShoppingCart },
]

function MyPageSidebar({ activeKey = 'profile' }) {
  const navigate = useNavigate()
  const name = useAuthStore((state) => state.name)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const avatarInitial = name ? name.charAt(0) : '?'

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white flex flex-col">
      <div className="flex flex-col items-center gap-[10px] pt-7 pr-5 pb-6 pl-5 border-b border-[#E8ECEF]">
        <div className="w-[68px] h-[68px] rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[26px] font-bold">
          {avatarInitial}
        </div>
        <span className="text-[#111827] text-base font-bold">{name || '사용자'}</span>
        <span className="bg-[#EFF6FF] text-[#2563EB] text-[11px] font-medium rounded-full px-3 py-1">
          일반회원
        </span>
      </div>

      <nav className="flex flex-col gap-1 py-4 px-[10px] flex-1">
        {MENU_ITEMS.map(({ key, label, to, icon: Icon }) => {
          const isActive = key === activeKey
          const baseClass = 'h-12 rounded-lg px-4 flex items-center gap-3 transition-colors'
          const activeClass =
            'bg-[#EFF6FF] border-l-[3px] border-l-[#2563EB] pl-[13px]'
          const inactiveClass = 'hover:bg-gray-50'
          return (
            <Link
              key={key}
              to={to}
              className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
            >
              <Icon size={18} color={isActive ? '#2563EB' : '#6B7280'} />
              <span
                className={
                  isActive
                    ? 'text-sm text-[#2563EB] font-semibold'
                    : 'text-sm text-[#4B5563]'
                }
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="py-[18px] px-6 border-t border-[#E8ECEF]">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          <LogOut size={18} color="#9CA3AF" />
          <span className="text-sm text-[#9CA3AF]">로그아웃</span>
        </button>
      </div>
    </aside>
  )
}

export default MyPageSidebar
