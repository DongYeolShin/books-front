import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import {
  fetchCarts,
  removeCart,
  updateCart,
} from '../services/cartService'
import LoadingOverlay from '../components/LoadingOverlay'

const formatPrice = (value) =>
  typeof value === 'number' ? value.toLocaleString() : value

function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mutating, setMutating] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchCarts()
        if (cancelled) return
        setItems(result?.data ?? [])
      } catch {
        if (!cancelled) setError('장바구니 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const totalCount = items.length
  const totalOriginal = items.reduce(
    (sum, b) => sum + (b.originalPrice ?? 0) * (b.quantity ?? 1),
    0,
  )
  const totalSale = items.reduce(
    (sum, b) => sum + (b.salePrice ?? b.originalPrice ?? 0) * (b.quantity ?? 1),
    0,
  )
  const discount = totalOriginal - totalSale

  const handleChangeQuantity = async (bookId, nextQuantity) => {
    if (mutating) return
    if (nextQuantity < 1) return
    setMutating(true)
    try {
      const result = await updateCart({ bookId, quantity: nextQuantity })
      if (result?.code === 200) {
        setItems((prev) =>
          prev.map((b) =>
            b.bookId === bookId ? { ...b, quantity: nextQuantity } : b,
          ),
        )
      } else {
        alert(result?.message || '수정이 실패되었습니다.')
      }
    } catch (e) {
      alert(e?.response?.data?.message || '수정이 실패되었습니다.')
    } finally {
      setMutating(false)
    }
  }

  const handleRemove = async (bookId) => {
    if (mutating) return
    setMutating(true)
    try {
      const result = await removeCart(bookId)
      if (result?.code === 200) {
        setItems((prev) => prev.filter((b) => b.bookId !== bookId))
      } else {
        alert(result?.message || '삭제 실패되었습니다.')
      }
    } catch (e) {
      alert(e?.response?.data?.message || '삭제 실패되었습니다.')
    } finally {
      setMutating(false)
    }
  }

  const handleOrder = () => {
    if (items.length === 0) {
      alert('선택된 상품이 없습니다.')
      return
    }
    navigate('/order', {
      state: {
        books: items.map((b) => ({
          bookId: b.bookId,
          quantity: b.quantity ?? 1,
        })),
      },
    })
  }

  return (
    <div className="bg-[#F5F5F8] -mx-6 -my-8 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E5] h-16 px-10 flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#1F2937]">장바구니</h1>
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
            {/* ── Left ────────────────────────────────────── */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <section className="bg-white rounded-xl flex flex-col">
                <div className="bg-[#FAFAFA] rounded-t-xl px-6 py-4 flex items-center gap-3">
                  <span className="w-5 h-5 rounded bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-[#374151]">
                    전체선택 ({totalCount}/{totalCount})
                  </span>
                </div>
                <div className="h-px bg-[#EEEEEE]" />

                {items.length === 0 ? (
                  <p className="py-16 text-center text-[#9CA3AF] text-[15px]">
                    장바구니에 담긴 상품이 없습니다.
                  </p>
                ) : (
                  <ul className="flex flex-col">
                    {items.map((book, idx) => (
                      <li key={book.bookId}>
                        <div className="flex items-center gap-4 px-6 py-5">
                          <span className="w-5 h-5 rounded bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            ✓
                          </span>
                          <div className="w-[70px] h-[90px] rounded-md bg-[#E8E8E8] overflow-hidden flex items-center justify-center flex-shrink-0">
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
                            <p className="text-[15px] font-semibold text-[#1F2937] truncate">
                              {book.title}
                            </p>
                            <p className="text-[13px] text-[#888888]">
                              {book.author}
                            </p>
                          </div>
                          <div className="flex items-center flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const q = book.quantity ?? 1
                                if (q <= 1) return
                                handleChangeQuantity(book.bookId, q - 1)
                              }}
                              disabled={mutating}
                              className="w-8 h-8 rounded-l-md border border-[#D1D5DB] bg-white text-[#374151] text-base font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <div className="w-10 h-8 border-y border-[#D1D5DB] bg-white flex items-center justify-center text-sm font-semibold text-[#1F2937]">
                              {book.quantity ?? 1}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleChangeQuantity(
                                  book.bookId,
                                  (book.quantity ?? 1) + 1,
                                )
                              }
                              disabled={mutating}
                              className="w-8 h-8 rounded-r-md border border-[#D1D5DB] bg-white text-[#374151] text-base font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                          <p className="w-[80px] text-right text-[15px] font-bold text-[#1F2937] flex-shrink-0">
                            {formatPrice(
                              (book.salePrice ?? book.originalPrice ?? 0) *
                                (book.quantity ?? 1),
                            )}
                            원
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemove(book.bookId)}
                            disabled={mutating}
                            className="w-14 h-[34px] rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] text-[13px] font-semibold flex-shrink-0 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            삭제
                          </button>
                        </div>
                        {idx < items.length - 1 && (
                          <div className="h-px bg-[#F0F0F0]" />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* ── Right ───────────────────────────────────── */}
            <aside className="w-[380px] flex flex-col gap-4 flex-shrink-0">
              <section className="bg-white rounded-xl p-6 flex flex-col gap-[18px]">
                <h2 className="text-[18px] font-bold text-[#1F2937]">
                  주문 요약
                </h2>
                <div className="h-px bg-[#EEEEEE]" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">
                    선택 상품 ({totalCount}건)
                  </span>
                  <span className="text-sm text-[#1F2937]">
                    {formatPrice(totalOriginal)}원
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">할인금액</span>
                  <span className="text-sm font-semibold text-[#EF4444]">
                    -{formatPrice(discount)}원
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">배송비</span>
                  <span className="text-sm font-semibold text-[#2563EB]">
                    무료
                  </span>
                </div>

                <div className="h-px bg-[#EEEEEE]" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#1F2937]">
                    총 결제금액
                  </span>
                  <span className="text-[22px] font-bold text-[#1F2937]">
                    {formatPrice(totalSale)}원
                  </span>
                </div>
              </section>

              <button
                type="button"
                onClick={handleOrder}
                className="h-14 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[17px] font-bold transition-colors"
              >
                주문하기
              </button>

              <section className="bg-white rounded-xl px-6 py-5 flex flex-col gap-2.5">
                <h3 className="text-sm font-bold text-[#374151]">안내사항</h3>
                <p className="text-[13px] text-[#9CA3AF]">
                  • 장바구니 상품은 최대 30일간 보관됩니다.
                </p>
                <p className="text-[13px] text-[#9CA3AF]">
                  • 가격, 옵션 등 정보가 변경될 수 있습니다.
                </p>
              </section>
            </aside>
          </div>
        )}
      </div>

      <LoadingOverlay open={mutating} />
    </div>
  )
}

export default CartPage
