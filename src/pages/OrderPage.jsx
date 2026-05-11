import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Trash2 } from 'lucide-react'
import { fetchOrderBooks } from '../services/orderService'
import useAuthStore from '../stores/authStore'

const DAUM_POSTCODE_SRC =
  '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

const QUICK_POINTS = [1000, 5000, 10000]

const formatPrice = (value) =>
  typeof value === 'number' ? value.toLocaleString() : value

const loadDaumPostcode = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window 객체가 없습니다.'))
      return
    }
    if (window.daum?.Postcode) {
      resolve(window.daum)
      return
    }
    const existing = document.querySelector(
      `script[src="${DAUM_POSTCODE_SRC}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(window.daum))
      existing.addEventListener('error', () =>
        reject(new Error('주소 검색 스크립트 로드 실패')),
      )
      return
    }
    const script = document.createElement('script')
    script.src = DAUM_POSTCODE_SRC
    script.async = true
    script.onload = () => resolve(window.daum)
    script.onerror = () => reject(new Error('주소 검색 스크립트 로드 실패'))
    document.head.appendChild(script)
  })

function OrderPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const myPoints = useAuthStore((state) => state.points)
  const orderItems = useMemo(
    () => location.state?.books ?? [],
    [location.state],
  )

  const [orderBooks, setOrderBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [recipient, setRecipient] = useState('')
  const [phone, setPhone] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [pointInput, setPointInput] = useState('')
  const [pointOverWarn, setPointOverWarn] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!orderItems || orderItems.length === 0) {
        setOrderBooks([])
        setLoading(false)
        setError('주문할 도서 정보가 없습니다.')
        return
      }
      try {
        setLoading(true)
        setError(null)
        const ids = orderItems.map((item) => item.bookId).join(',')
        const result = await fetchOrderBooks(ids)
        if (cancelled) return
        const list = result?.data ?? []
        const merged = list.map((book) => {
          const matched = orderItems.find(
            (item) => item.bookId === book.bookId,
          )
          return {
            ...book,
            quantity: matched?.quantity ?? 1,
          }
        })
        setOrderBooks(merged)
      } catch {
        if (!cancelled) setError('주문 도서 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [orderItems])

  const totalOriginal = useMemo(
    () =>
      orderBooks.reduce(
        (sum, b) => sum + (b.originalPrice ?? 0) * b.quantity,
        0,
      ),
    [orderBooks],
  )
  const totalSale = useMemo(
    () =>
      orderBooks.reduce(
        (sum, b) => sum + (b.salePrice ?? b.originalPrice ?? 0) * b.quantity,
        0,
      ),
    [orderBooks],
  )
  const discount = totalOriginal - totalSale

  const enteredPoints = useMemo(
    () => Number(pointInput.replace(/[^0-9]/g, '')) || 0,
    [pointInput],
  )
  const usedPoints = useMemo(
    () => Math.min(enteredPoints, totalSale),
    [enteredPoints, totalSale],
  )

  const applyPoints = (value) => {
    if (value > myPoints) {
      setPointInput(String(myPoints))
      setPointOverWarn(true)
    } else {
      setPointInput(value > 0 ? String(value) : '')
      setPointOverWarn(false)
    }
  }

  const finalPrice = Math.max(0, totalSale - usedPoints)

  const handleSearchAddress = async () => {
    try {
      await loadDaumPostcode()
      new window.daum.Postcode({
        oncomplete: (data) => {
          setZipcode(data.zonecode)
          setAddress(data.roadAddress || data.jibunAddress || data.address)
        },
      }).open()
    } catch (e) {
      alert(e.message || '주소 검색을 사용할 수 없습니다.')
    }
  }

  const handleUseAllPoints = () => {
    const maxUsable = Math.min(myPoints, totalSale)
    setPointInput(String(maxUsable))
    setPointOverWarn(false)
  }

  const handleAddPoints = (amount) => {
    const current = Number(pointInput.replace(/[^0-9]/g, '')) || 0
    applyPoints(current + amount)
  }

  const handleRemoveBook = (bookId) => {
    setOrderBooks((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((b) => b.bookId !== bookId)
    })
  }

  const handlePay = () => {
    if (!recipient.trim()) return alert('수령인을 입력하세요.')
    if (!phone.trim()) return alert('연락처를 입력하세요.')
    if (!zipcode || !address) return alert('주소를 검색해 입력하세요.')
    if (!detailAddress.trim()) return alert('상세 주소를 입력하세요.')
    alert(`결제금액 ${formatPrice(finalPrice)}원으로 결제를 진행합니다.`)
  }

  return (
    <div className="bg-[#F5F5F8] -mx-6 -my-8 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E5] h-16 px-10 flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#1F2937]">주문하기</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937]"
        >
          ← 쇼핑 계속하기
        </button>
      </div>

      {/* Body */}
      <div className="px-10 pt-8 pb-10">
        {loading ? (
          <div className="py-16 text-center text-gray-500">불러오는 중...</div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">{error}</div>
        ) : (
          <div className="flex gap-8 items-start">
            {/* ── Left ───────────────────────────────────── */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">
              {/* 배송지 정보 */}
              <section className="bg-white rounded-xl p-6 flex flex-col gap-5">
                <h2 className="text-[18px] font-bold text-[#1F2937]">
                  배송지 정보
                </h2>
                <div className="h-px bg-[#EEEEEE]" />

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#555555]">
                    수령인
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="h-[46px] px-3.5 rounded-lg bg-[#F8F8F8] border border-[#E0E0E0] text-sm text-[#1F2937] placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#555555]">
                    연락처
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="연락처를 입력하세요"
                    className="h-[46px] px-3.5 rounded-lg bg-[#F8F8F8] border border-[#E0E0E0] text-sm text-[#1F2937] placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#555555]">
                    주소
                  </label>
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      value={zipcode}
                      readOnly
                      placeholder="우편번호"
                      className="flex-1 h-[46px] px-3.5 rounded-lg bg-[#F8F8F8] border border-[#E0E0E0] text-sm text-[#1F2937] placeholder:text-[#AAAAAA]"
                    />
                    <input
                      type="text"
                      value={address}
                      readOnly
                      placeholder="주소"
                      className="flex-[2] h-[46px] px-3.5 rounded-lg bg-[#F8F8F8] border border-[#E0E0E0] text-sm text-[#1F2937] placeholder:text-[#AAAAAA]"
                    />
                    <button
                      type="button"
                      onClick={handleSearchAddress}
                      className="w-[100px] h-[46px] rounded-lg bg-[#1F2937] text-white text-sm font-semibold hover:bg-[#111827] transition-colors"
                    >
                      검색
                    </button>
                  </div>
                  <input
                    type="text"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="상세 주소를 입력하세요"
                    className="h-[46px] px-3.5 rounded-lg bg-[#F8F8F8] border border-[#E0E0E0] text-sm text-[#1F2937] placeholder:text-[#AAAAAA] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </section>

              {/* 포인트 사용 */}
              <section className="bg-white rounded-xl p-6 flex flex-col gap-4">
                <h2 className="text-[18px] font-bold text-[#1F2937]">
                  포인트 사용
                </h2>
                <div className="h-px bg-[#EEEEEE]" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6B7280]">
                    보유 포인트
                  </span>
                  <span className="text-[15px] font-bold text-[#2563EB]">
                    {formatPrice(myPoints)} P
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pointInput}
                    onChange={(e) => {
                      const raw =
                        Number(e.target.value.replace(/[^0-9]/g, '')) || 0
                      applyPoints(raw)
                    }}
                    placeholder="사용할 포인트를 입력하세요"
                    className={`flex-1 h-[46px] px-3.5 rounded-lg bg-[#F8F8F8] border text-sm text-[#1F2937] placeholder:text-[#AAAAAA] focus:outline-none ${
                      pointOverWarn
                        ? 'border-[#EF4444] focus:border-[#EF4444]'
                        : 'border-[#E0E0E0] focus:border-[#2563EB]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleUseAllPoints}
                    className="w-[100px] h-[46px] rounded-lg bg-[#333333] text-white text-sm font-bold hover:bg-black transition-colors"
                  >
                    전액사용
                  </button>
                </div>

                <div className="flex gap-2">
                  {QUICK_POINTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAddPoints(amount)}
                      className="flex-1 h-9 rounded-md border border-[#E0E0E0] bg-white text-[13px] font-medium text-[#374151] hover:bg-[#F5F5F5] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                    >
                      +{formatPrice(amount)}P
                    </button>
                  ))}
                </div>

                {pointOverWarn && (
                  <p className="text-[13px] font-medium text-[#EF4444]">
                    보유 포인트({formatPrice(myPoints)}P)를 초과하여 최대값으로
                    설정되었습니다.
                  </p>
                )}
              </section>

              {/* 주문 상품 */}
              <section className="bg-white rounded-xl p-6 flex flex-col gap-4">
                <h2 className="text-[18px] font-bold text-[#1F2937]">
                  주문 상품
                </h2>
                <div className="h-px bg-[#EEEEEE]" />

                <ul className="flex flex-col">
                  {orderBooks.map((book, idx) => {
                    const canDelete = orderBooks.length > 1
                    return (
                      <li key={book.bookId}>
                        <div className="flex items-center gap-3.5 py-2">
                          <div className="w-[60px] h-[80px] rounded-md bg-[#E8E8E8] overflow-hidden flex items-center justify-center flex-shrink-0">
                            {book.imageUrl ? (
                              <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen size={24} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col gap-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1F2937] truncate">
                              {book.title}
                            </p>
                            <p className="text-[13px] text-[#888888]">
                              수량: {book.quantity}개
                            </p>
                            <p className="text-sm font-semibold text-[#1F2937]">
                              {formatPrice(
                                (book.salePrice ?? book.originalPrice) *
                                  book.quantity,
                              )}
                              원
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBook(book.bookId)}
                            disabled={!canDelete}
                            aria-label="상품 삭제"
                            title={
                              canDelete
                                ? '상품 삭제'
                                : '주문 상품은 최소 1개 이상이어야 합니다.'
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E0E0E0] bg-white text-[#888888] hover:bg-[#F5F5F5] hover:text-[#EF4444] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#888888] disabled:cursor-not-allowed transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} strokeWidth={2} />
                          </button>
                        </div>
                        {idx < orderBooks.length - 1 && (
                          <div className="h-px bg-[#F0F0F0]" />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>
            </div>

            {/* ── Right ──────────────────────────────────── */}
            <aside className="w-[380px] flex flex-col gap-4 flex-shrink-0">
              <section className="bg-white rounded-xl p-6 flex flex-col gap-5">
                <h2 className="text-[18px] font-bold text-[#1F2937]">
                  주문 요약
                </h2>
                <div className="h-px bg-[#EEEEEE]" />

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">상품금액</span>
                    <span className="text-sm text-[#1F2937]">
                      {formatPrice(totalOriginal)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">배송비</span>
                    <span className="text-sm font-semibold text-[#2563EB]">
                      무료
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">할인금액</span>
                    <span className="text-sm font-semibold text-[#EF4444]">
                      -{formatPrice(discount)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">포인트 사용</span>
                    <span className="text-sm font-semibold text-[#EF4444]">
                      -{formatPrice(usedPoints)}원
                    </span>
                  </div>
                </div>

                <div className="h-px bg-[#EEEEEE]" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#1F2937]">
                    최종결제금액
                  </span>
                  <span className="text-[22px] font-bold text-[#1F2937]">
                    {formatPrice(finalPrice)}원
                  </span>
                </div>
              </section>

              <button
                type="button"
                onClick={handlePay}
                className="h-14 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[17px] font-bold transition-colors"
              >
                결제하기
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPage
