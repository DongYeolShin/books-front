import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { fetchBookById } from '../services/bookService'

const REVIEWS_PER_PAGE = 10

const formatPrice = (value) =>
  typeof value === 'number' ? value.toLocaleString() : value

const formatDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

function BookDetailPage() {
  const { bookId } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adExpanded, setAdExpanded] = useState(false)
  const [adImgHeight, setAdImgHeight] = useState(0)
  const [reviewPage, setReviewPage] = useState(1)
  const adImgRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchBookById(bookId)
        if (cancelled) return
        setBook(result?.data ?? null)
        setReviewPage(1)
        setAdExpanded(false)
        setAdImgHeight(0)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [bookId])

  const reviewList = useMemo(() => book?.reviewList ?? [], [book])
  const totalReviews = reviewList.length
  const totalPages = Math.max(1, Math.ceil(totalReviews / REVIEWS_PER_PAGE))
  const currentPageReviews = useMemo(() => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE
    return reviewList.slice(start, start + REVIEWS_PER_PAGE)
  }, [reviewList, reviewPage])

  if (loading) {
    return <div className="py-16 text-center text-gray-500">불러오는 중...</div>
  }

  if (error || !book) {
    return (
      <div className="py-16 text-center text-red-500">
        도서 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
      </div>
    )
  }

  const hasDiscount =
    typeof book.originalPrice === 'number' &&
    typeof book.salePrice === 'number' &&
    book.originalPrice > book.salePrice

  return (
    <div className="flex flex-col bg-[#F9FAFB]">
      {/* ── 1. Book Info Section ─────────────────────────── */}
      <section className="bg-white px-20 py-12">
        <div className="flex gap-12">
          <div className="w-[400px] h-[500px] rounded-xl bg-gradient-to-b from-[#DBEAFE] to-[#93C5FD] flex items-center justify-center overflow-hidden flex-shrink-0">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <BookOpen className="text-[#3B82F6]" size={64} strokeWidth={2} />
            )}
          </div>

          <div className="flex-1 flex flex-col gap-5 min-w-0">
            <h1 className="text-[28px] font-bold text-[#1F2937] leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-base font-normal text-[#6B7280]">
                {book.subtitle}
              </p>
            )}

            <div className="h-px bg-[#E5E7EB]" />

            <div className="flex gap-3 text-sm">
              <span className="text-[#6B7280] font-normal">저자</span>
              <span className="text-[#1F2937] font-semibold">{book.author}</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-[#6B7280] font-normal">출판사</span>
              <span className="text-[#1F2937] font-semibold">{book.publisher}</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-[#6B7280] font-normal">출간일</span>
              <span className="text-[#1F2937] font-semibold">
                {formatDate(book.publishDate)}
              </span>
            </div>

            <div className="h-px bg-[#E5E7EB]" />

            <div className="flex items-end gap-3">
              {hasDiscount && (
                <span className="text-[32px] font-bold text-gray-400 line-through decoration-[2px] leading-none">
                  {formatPrice(book.originalPrice)}원
                </span>
              )}
              <span className="text-[32px] font-bold text-red-700 leading-none">
                {formatPrice(book.salePrice ?? book.originalPrice)}원
              </span>
            </div>

            <div className="flex gap-3 pt-2 justify-start">
              <button
                type="button"
                className="w-[90px] h-14 rounded-lg bg-green-800 flex items-center justify-center gap-1 text-white text-sm font-bold hover:bg-green-900 transition-colors"
              >
                <ShoppingCart size={14} strokeWidth={2.25} color="#ffffff" />
                장바구니
              </button>
              <button
                type="button"
                className="w-[90px] h-14 rounded-lg bg-blue-900 flex items-center justify-center text-white text-sm font-bold hover:bg-blue-950 transition-colors"
              >
                바로구매
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Description Section ───────────────────────── */}
      <section className="bg-white px-20 py-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-[#1F2937]" strokeWidth={2} />
            <h2 className="text-[22px] font-bold text-[#1F2937]">책 소개</h2>
          </div>
          <p className="text-[15px] font-normal text-[#4B5563] leading-[1.7] whitespace-pre-wrap">
            {book.description}
          </p>
        </div>
      </section>

      {/* ── 3. Ad Section ────────────────────────────────── */}
      {book.contents && (
        <section className="bg-white pb-[50px] flex flex-col items-center gap-5">
          <div
            className="w-full overflow-hidden flex items-start justify-center transition-[max-height] duration-300 ease-out"
            style={{
              maxHeight: adExpanded
                ? '20000px'
                : adImgHeight > 0
                  ? `${Math.max(120, adImgHeight * 0.2)}px`
                  : '300px',
            }}
          >
            <img
              ref={adImgRef}
              src={book.contents}
              alt="상품 정보"
              className="w-full max-w-[800px] object-contain"
              onLoad={(e) => setAdImgHeight(e.currentTarget.clientHeight)}
            />
          </div>
          <button
            type="button"
            onClick={() => setAdExpanded((v) => !v)}
            className="w-[272px] py-4 rounded border border-[#3B82F6] bg-white flex items-center justify-center gap-2 text-[#3B82F6] text-[15px] font-medium hover:bg-blue-50 transition-colors"
          >
            {adExpanded ? '상품정보 접기' : '상품정보 더보기'}
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`transition-transform ${adExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </section>
      )}

      {/* ── 4. Review Section ────────────────────────────── */}
      <section className="bg-white px-20 py-12 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} className="text-[#1F2937]" strokeWidth={2} />
          <h2 className="text-[22px] font-bold text-[#1F2937]">리뷰</h2>
          <span className="text-base font-normal text-[#6B7280]">
            (총 {totalReviews}건)
          </span>
        </div>

        <div className="h-px bg-[#E5E7EB]" />

        {totalReviews === 0 ? (
          <p className="py-16 text-center text-[#9CA3AF] text-[15px]">
            리뷰가 없습니다.
          </p>
        ) : (
          <>
            <ul className="flex flex-col">
              {currentPageReviews.map((review, idx) => {
                const reviewer =
                  review.reviewer ?? review.userName ?? review.user ?? '익명'
                const reviewDate = formatDate(
                  review.createdAt ?? review.date ?? review.regDate,
                )
                const rating = Number(review.rating ?? review.star ?? 0)
                const content =
                  review.comment ?? review.content ?? review.text ?? ''
                return (
                  <li
                    key={review.reviewId ?? review.id ?? `${reviewer}-${idx}`}
                    className="py-5 border-b border-[#F3F4F6] flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-[#1F2937]">
                          {reviewer}
                        </span>
                        {rating > 0 && (
                          <span className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300 fill-gray-300'
                                }
                                strokeWidth={0}
                              />
                            ))}
                          </span>
                        )}
                      </div>
                      <span className="text-[13px] font-normal text-[#9CA3AF]">
                        {reviewDate}
                      </span>
                    </div>
                    <p className="text-[15px] font-normal text-[#4B5563] leading-[1.6] whitespace-pre-wrap">
                      {content}
                    </p>
                  </li>
                )
              })}
            </ul>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-6">
                <button
                  type="button"
                  onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                  disabled={reviewPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#9CA3AF] disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1
                  const active = pageNum === reviewPage
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setReviewPage(pageNum)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                        active
                          ? 'bg-[#2563EB] text-white font-semibold'
                          : 'border border-[#D1D5DB] text-[#374151] font-medium hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() =>
                    setReviewPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={reviewPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#374151] disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default BookDetailPage
