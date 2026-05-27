import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Check,
  User,
  MapPin,
  House,
  Package,
  BookOpen,
  Minus,
  Plus,
  Equal,
} from 'lucide-react'
import { fetchPaymentComplete } from '../services/paymentService'

const formatPrice = (value) =>
  typeof value === 'number' ? value.toLocaleString() : value

const formatDate = (value) => {
  if (!value) return '-'
  return value.replace(/-/g, '.')
}

function OrderCompletePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId') ?? ''

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchPaymentComplete(orderId)
        if (cancelled) return
        setData(res?.data ?? null)
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('결제 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="bg-[#F5F5F5] -mx-6 -my-8 min-h-[calc(100vh-64px)] py-16 text-center text-gray-500">
        결제 정보를 불러오는 중...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-[#F5F5F5] -mx-6 -my-8 min-h-[calc(100vh-64px)] py-16 text-center text-red-500">
        {error ?? '결제 정보를 찾을 수 없습니다.'}
      </div>
    )
  }

  const { orderList = [], usedPoints = 0, orders, shipping } = data

  const totalItemCount = orderList.reduce((sum, b) => sum + b.quantity, 0)
  const totalTypeCount = orderList.length

  const totalOriginal = orderList.reduce(
    (sum, b) => sum + (b.originalPrice ?? b.salePrice ?? 0) * b.quantity,
    0,
  )
  const totalSale = orderList.reduce(
    (sum, b) => sum + (b.salePrice ?? b.originalPrice ?? 0) * b.quantity,
    0,
  )
  const discount = totalOriginal - totalSale
  const finalPrice = Math.max(0, totalSale - usedPoints)

  return (
    <div className="bg-[#F5F5F5] -mx-6 -my-8 min-h-[calc(100vh-64px)] px-20 py-[60px]">
      <div className="flex flex-col gap-4">
        {/* successCard */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] px-12 pt-12 pb-10 flex flex-col items-center gap-4">
          <div className="w-[72px] h-[72px] rounded-full bg-black flex items-center justify-center">
            <Check size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-black">주문이 완료되었습니다</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#888888]">주문번호</span>
            <span className="text-sm font-semibold text-black">
              {data.orderId}
            </span>
          </div>
          <p
            className="text-[13px] text-[#888888] text-center"
            style={{ lineHeight: 1.8 }}
          >
            주문하신 상품은 결제 확인 후 배송이 시작됩니다.
            <br />
            배송 현황은 마이페이지에서 확인하실 수 있습니다.
          </p>
        </div>

        {/* orderCard */}
        <div className="bg-white rounded-[10px] border border-[#E5E5E5] flex flex-col">
          <div className="flex items-center justify-between px-6 py-[18px] border-b border-[#F0F0F0]">
            <span className="text-sm font-bold text-black">주문 상품</span>
            <span className="text-[13px] text-[#888888]">
              총 {totalTypeCount}종 {totalItemCount}권
            </span>
          </div>
          {orderList.map((book, idx) => (
            <div
              key={book.bookId}
              className={`flex items-center gap-3.5 px-6 py-5 ${
                idx < orderList.length - 1 ? 'border-b border-[#F5F5F5]' : ''
              }`}
            >
              <div className="w-[52px] h-[72px] rounded-[5px] bg-[#E8E4DF] flex items-center justify-center overflow-hidden flex-shrink-0">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen size={20} className="text-[#999]" />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-[5px] min-w-0">
                <p className="text-[15px] italic font-serif text-black truncate">
                  {book.title}
                </p>
                <p className="text-xs text-[#888888]">
                  {book.author}
                  {book.publisher ? ` · ${book.publisher}` : ''}
                </p>
                <p className="text-xs text-[#AAAAAA]">{book.quantity}권</p>
              </div>
              <p className="text-sm font-bold text-black">
                {formatPrice(
                  (book.salePrice ?? book.originalPrice) * book.quantity,
                )}
                원
              </p>
            </div>
          ))}
        </div>

        {/* priceCalcCard */}
        <div className="bg-white rounded-[10px] border border-[#E5E5E5] px-6 py-5 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1.5 px-6">
            <span className="text-xs text-[#888888]">상품 금액</span>
            <span className="text-lg font-bold text-black">
              {formatPrice(totalOriginal)}원
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-2">
            <Minus size={18} className="text-[#BBBBBB]" />
            <span className="text-[11px] text-[#BBBBBB]">할인</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-6">
            <span className="text-xs text-[#888888]">할인 금액</span>
            <span className="text-lg font-bold text-black">
              {formatPrice(discount + usedPoints)}원
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-2">
            <Plus size={18} className="text-[#BBBBBB]" />
            <span className="text-[11px] text-[#BBBBBB]">배송비</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-6">
            <span className="text-xs text-[#888888]">배송비</span>
            <span className="text-lg font-bold text-[#2A9D8F]">무료</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-2">
            <Equal size={18} className="text-[#BBBBBB]" />
            <span className="text-[11px] text-[#BBBBBB]">합계</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-6 py-1 rounded-lg bg-[#F8F8F8]">
            <span className="text-xs font-semibold text-[#444444]">
              최종 결제금액
            </span>
            <span className="text-[22px] font-bold text-black">
              {formatPrice(finalPrice)}원
            </span>
          </div>
        </div>

        {/* infoCards */}
        <div className="flex gap-4">
          {/* ordererCard */}
          <div className="flex-1 bg-white rounded-[10px] border border-[#E5E5E5] flex flex-col">
            <div className="flex items-center gap-2 px-6 py-[18px] border-b border-[#F0F0F0]">
              <User size={15} className="text-[#555555]" />
              <span className="text-sm font-bold text-black">주문자 정보</span>
            </div>
            <div className="flex flex-col gap-3.5 px-6 py-5">
              <InfoRow label="이름" value={orders?.name} bold />
              <InfoRow label="연락처" value={orders?.phone} />
              <InfoRow label="이메일" value={orders?.email} />
              <InfoRow label="결제수단" value={orders?.paymethod} />
              <InfoRow label="주문일" value={formatDate(orders?.orderDate)} />
            </div>
          </div>

          {/* shipCard2 */}
          <div className="flex-1 bg-white rounded-[10px] border border-[#E5E5E5] flex flex-col">
            <div className="flex items-center gap-2 px-6 py-[18px] border-b border-[#F0F0F0]">
              <MapPin size={15} className="text-[#555555]" />
              <span className="text-sm font-bold text-black">배송 정보</span>
            </div>
            <div className="flex flex-col gap-3.5 px-6 py-5">
              <InfoRow label="수령인" value={shipping?.name} bold />
              <InfoRow label="연락처" value={shipping?.phone} />
              <div className="flex">
                <span className="w-20 text-[13px] text-[#888888] flex-shrink-0">
                  주소
                </span>
                <span
                  className="text-[13px] text-[#1A1A1A] flex-1"
                  style={{ lineHeight: 1.7 }}
                >
                  {shipping?.address}
                  {shipping?.addressDetail ? (
                    <>
                      <br />
                      {shipping.addressDetail}
                    </>
                  ) : null}
                </span>
              </div>
              {shipping?.request && (
                <InfoRow label="요청사항" value={shipping.request} />
              )}
              <div className="flex items-center">
                <span className="w-20 text-[13px] text-[#888888] flex-shrink-0">
                  배송 상태
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-[#FFF3E0] px-2.5 py-1 text-[12px] font-semibold text-[#E07B00]">
                  {shipping?.status ?? '준비중'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* btnRow */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="h-12 px-8 rounded-lg border border-[#DDDDDD] bg-white flex items-center justify-center gap-1.5 text-sm text-[#555555] hover:bg-[#F5F5F5] transition-colors"
          >
            <House size={15} className="text-[#555555]" />
            홈으로 돌아가기
          </button>
          <button
            type="button"
            onClick={() => navigate('/mypage/orders')}
            className="h-12 px-8 rounded-lg bg-black flex items-center justify-center gap-1.5 text-sm font-semibold text-white hover:bg-[#1F1F1F] transition-colors"
          >
            <Package size={15} className="text-white" />
            주문 내역 확인
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, bold = false }) {
  return (
    <div className="flex items-center">
      <span className="w-20 text-[13px] text-[#888888] flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-[13px] text-[#1A1A1A] ${bold ? 'font-semibold' : ''}`}
      >
        {value || '-'}
      </span>
    </div>
  )
}

export default OrderCompletePage
