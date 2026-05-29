import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MyPageSidebar from '../components/MyPageSidebar'
import { fetchMyOrders } from '../services/orderService'
import styles from './OrderListPage.module.css'

const PAGE_SIZE = 10
const PAGE_WINDOW = 5

function OrderListPage() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchMyOrders(page)
        if (cancelled) return
        setOrders(Array.isArray(res?.data) ? res.data : [])
        setTotalRows(res?.pageInfo?.totalRows ?? 0)
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('주문 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE))

  return (
    <div className="-mx-6 -my-8 min-h-[calc(100vh-64px)] flex bg-[#F3F4F6]">
      <MyPageSidebar activeKey="orders" />
      <div className="flex-1 py-8 px-9 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[#111827] text-xl font-bold">주문/배송목록</h1>
          <span className="bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold rounded-full px-2.5 py-1">
            총 {totalRows}건
          </span>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] flex flex-col">
          <TableHeader />
          {loading ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              주문 목록을 불러오는 중...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-500 text-sm">{error}</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              주문 내역이 없습니다.
            </div>
          ) : (
            orders.map((order, idx) => (
              <div key={order.orderId}>
                {idx > 0 && <div className="h-px bg-[#F3F4F6]" />}
                <OrderRow order={order} />
              </div>
            ))
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  )
}

function TableHeader() {
  return (
    <div className="flex items-center bg-[#F9FAFB] h-11 border-b border-[#E5E7EB] text-[#6B7280] text-xs font-semibold">
      <div className="flex-1 px-6">상품정보</div>
      <div className="w-[140px] text-center">총 가격</div>
      <div className="w-[120px] text-center">상태</div>
      <div className="w-[140px] text-center">구매날짜</div>
    </div>
  )
}

function OrderRow({ order }) {
  return (
    <div className="flex items-center h-20">
      <div className="flex-1 flex items-center gap-4 px-6">
        <div
          className={`w-12 h-[62px] rounded flex items-center justify-center ${styles.thumbnail}`}
        >
          {order.imageUrl ? (
            <img
              src={order.imageUrl}
              alt=""
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span className="text-lg">📖</span>
          )}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[#111827] text-sm font-semibold truncate">
            {order.orderName || '-'}
          </span>
        </div>
      </div>
      <div className="w-[140px] flex justify-center">
        <span className="text-[#111827] text-sm font-bold">
          {formatAmount(order.totalAmount)}
        </span>
      </div>
      <div className="w-[120px] flex justify-center">
        <span className={statusBadgeClass(order.status)}>
          {order.status || '-'}
        </span>
      </div>
      <div className="w-[140px] flex justify-center">
        <span className="text-[#6B7280] text-[13px]">
          {formatDate(order.orderDate)}
        </span>
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  const pages = useMemo(() => {
    const start = Math.max(1, Math.min(page - Math.floor(PAGE_WINDOW / 2), totalPages - PAGE_WINDOW + 1))
    const from = Math.max(1, start)
    const to = Math.min(totalPages, from + PAGE_WINDOW - 1)
    const arr = []
    for (let i = from; i <= to; i++) arr.push(i)
    return arr
  }, [page, totalPages])

  const goto = (next) => {
    if (next < 1 || next > totalPages || next === page) return
    onChange(next)
  }

  const btnBase =
    'w-9 h-9 rounded-md border flex items-center justify-center text-sm transition-colors'

  return (
    <div className="flex items-center justify-center gap-1 py-2">
      <button
        type="button"
        onClick={() => goto(page - 1)}
        disabled={page === 1}
        className={`${btnBase} bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="이전 페이지"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => goto(p)}
          className={
            p === page
              ? `${btnBase} bg-[#2563EB] border-[#2563EB] text-white font-semibold`
              : `${btnBase} bg-white border-[#E5E7EB] text-[#374151] hover:bg-gray-50`
          }
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => goto(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="다음 페이지"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === '') return '-'
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  return `${n.toLocaleString()}원`
}

function formatDate(value) {
  if (!value) return '-'
  return String(value).replaceAll('-', '.')
}

function statusBadgeClass(status) {
  const base = 'text-[11px] font-semibold rounded-full px-2.5 py-1'
  switch (status) {
    case '배송완료':
      return `${base} bg-[#DCFCE7] text-[#15803D]`
    case '배송중':
      return `${base} bg-[#DBEAFE] text-[#1D4ED8]`
    case '결제 완료':
    case '결제완료':
      return `${base} bg-[#FEF3C7] text-[#B45309]`
    case '주문취소':
      return `${base} bg-[#FEE2E2] text-[#B91C1C]`
    default:
      return `${base} bg-[#F3F4F6] text-[#374151]`
  }
}

export default OrderListPage
