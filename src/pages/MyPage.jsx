import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Coins } from 'lucide-react'
import styles from './MyPage.module.css'
import useAuthStore from '../stores/authStore'
import { fetchMyPageProfile } from '../services/myPageService'
import MyPageSidebar from '../components/MyPageSidebar'

function MyPage() {
  const points = useAuthStore((state) => state.points)

  const [myInfo, setMyInfo] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchMyPageProfile()
        if (cancelled) return
        setMyInfo(res?.data?.myInfo ?? null)
        setRecentOrders(res?.data?.recentOrders ?? [])
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('프로필 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="-mx-6 -my-8 min-h-[calc(100vh-64px)] flex bg-[#F3F4F6] items-center justify-center text-gray-500">
        프로필을 불러오는 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="-mx-6 -my-8 min-h-[calc(100vh-64px)] flex bg-[#F3F4F6] items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="-mx-6 -my-8 min-h-[calc(100vh-64px)] flex bg-[#F3F4F6]">
      <MyPageSidebar activeKey="profile" />
      <MainContent myInfo={myInfo} recentOrders={recentOrders} points={points} />
    </div>
  )
}

function MainContent({ myInfo, recentOrders, points }) {
  return (
    <div className="flex-1 py-8 px-9 flex flex-col">
      <h1 className="text-[#111827] text-xl font-bold pb-5">내 정보</h1>

      {/* 기본 정보 card */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] flex flex-col">
        {/* Card header */}
        <div className="px-6 py-5 flex justify-between items-center">
          <span className="text-[#111827] text-[15px] font-bold">기본 정보</span>
          <button
            type="button"
            className="bg-[#2563EB] text-white text-[13px] font-semibold rounded-md px-4 py-1.5"
          >
            정보 수정
          </button>
        </div>
        <div className="h-px bg-[#E5E7EB]" />

        {/* Row: 이름 | 생년월일 */}
        <ProfileRow2Col
          label1="이름"
          value1={myInfo?.name}
          label2="생년월일"
          value2={myInfo?.birth}
        />

        {/* Row: 성별 | 전화번호 */}
        <ProfileRow2Col
          label1="성별"
          value1={myInfo?.gender}
          label2="전화번호"
          value2={myInfo?.phone}
        />

        {/* Row: 이메일 */}
        <ProfileRow1Col label="이메일" value={myInfo?.email} withBorder />

        {/* Row: 주소 */}
        <ProfileRow1Col label="주소" value={myInfo?.address} withBorder />

        {/* Row: 상세주소 */}
        <ProfileRow1Col label="상세주소" value={myInfo?.addressDetail} withBorder={false} />
      </div>

      <div className="h-6" />

      {/* 보유 포인트 card */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-3">
          <Coins size={18} color="#2563EB" />
          <span className="text-[#374151] text-sm font-semibold">보유 포인트</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#2563EB] text-xl font-bold">
            {Number(points || 0).toLocaleString()}
          </span>
          <span className="text-[#2563EB] text-sm font-semibold">P</span>
        </div>
        <button
          type="button"
          className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-md py-[7px] px-4 text-[#374151] text-[13px] font-semibold"
        >
          포인트 수정
        </button>
      </div>

      <div className="h-6" />

      {/* 최근 주문 내역 card */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] flex flex-col">
        {/* Card header */}
        <div className="px-6 py-5 flex justify-between items-center">
          <span className="text-[#111827] text-[15px] font-bold">최근 주문 내역</span>
          <Link
            to="/mypage/orders"
            className="text-[#2563EB] text-[13px] font-medium"
          >
            전체 주문 보기 →
          </Link>
        </div>
        <div className="h-px bg-[#E5E7EB]" />

        {recentOrders.map((order, idx) => (
          <div key={order.orderId ?? `${order.title}-${order.orderDate}-${idx}`}>
            {idx > 0 && <div className="h-px bg-[#F3F4F6]" />}
            <div className="flex items-center gap-4 px-6 py-4">
              {/* Thumbnail */}
              <div
                className={`w-12 h-16 rounded flex items-center justify-center ${styles.orderThumbnail}`}
              >
                <span className="text-lg">📖</span>
              </div>
              {/* Middle */}
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[#9CA3AF] text-[11px]">{order.orderDate}</span>
                <span className="text-[#111827] text-sm font-semibold">{order.title}</span>
                <span className="text-[#6B7280] text-xs">{order.author}</span>
              </div>
              {/* Right */}
              <div className="flex flex-col items-end gap-2">
                <span className="text-[#111827] text-[15px] font-bold">
                  {formatAmount(order.amount)}
                </span>
                <span className={statusBadgeClass(order.status)}>
                  {order.status || '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === '') return '-'
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  return `${n.toLocaleString()}원`
}

function statusBadgeClass(status) {
  const base = 'text-[11px] font-semibold rounded-full px-2.5 py-1'
  switch (status) {
    case '배송완료':
      return `${base} bg-[#DCFCE7] text-[#15803D]`
    case '배송중':
      return `${base} bg-[#DBEAFE] text-[#1D4ED8]`
    case '주문취소':
      return `${base} bg-[#FEE2E2] text-[#B91C1C]`
    default:
      return `${base} bg-[#F3F4F6] text-[#374151]`
  }
}

function ProfileRow2Col({ label1, value1, label2, value2 }) {
  return (
    <div className="flex border-b border-[#E5E7EB]">
      <div className="w-[140px] flex-shrink-0 flex items-center px-6 h-[52px] bg-[#F9FAFB] border-r border-[#E5E7EB] text-[#374151] text-[13px] font-semibold">
        {label1}
      </div>
      <div className="flex-1 flex items-center px-5 h-[52px] text-[#111827] text-sm">
        {value1 || '-'}
      </div>
      <div className="w-px bg-[#E5E7EB] self-stretch" />
      <div className="w-[140px] flex-shrink-0 flex items-center px-6 h-[52px] bg-[#F9FAFB] border-r border-[#E5E7EB] text-[#374151] text-[13px] font-semibold">
        {label2}
      </div>
      <div className="flex-1 flex items-center px-5 h-[52px] text-[#111827] text-sm">
        {value2 || '-'}
      </div>
    </div>
  )
}

function ProfileRow1Col({ label, value, withBorder = true }) {
  return (
    <div className={`flex ${withBorder ? 'border-b border-[#E5E7EB]' : ''}`}>
      <div className="w-[140px] flex-shrink-0 flex items-center px-6 h-[52px] bg-[#F9FAFB] border-r border-[#E5E7EB] text-[#374151] text-[13px] font-semibold">
        {label}
      </div>
      <div className="flex-1 flex items-center px-5 h-[52px] text-[#111827] text-sm">
        {value || '-'}
      </div>
    </div>
  )
}

export default MyPage
