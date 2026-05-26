import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
} from 'lucide-react'
import { fetchBooks } from '../services/bookService'
import { addCart } from '../services/cartService'
import useAuthStore, { selectIsAuthenticated } from '../stores/authStore'
import usePendingCartStore from '../stores/pendingCartStore'
import ConfirmModal from '../components/ConfirmModal'

const CATEGORY_TITLES = {
  bestseller: '베스트 셀러',
  new: '새로운 책',
  basic: '기본서',
  mobile: '모바일',
  web: '웹프로그래밍',
}

const PAGE_SIZE_OPTIONS = [10, 30, 50]

const COVER_THEMES = [
  { from: '#DBEAFE', to: '#BFDBFE', icon: '#3B82F6' },
  { from: '#FEF3C7', to: '#FDE68A', icon: '#D97706' },
  { from: '#D1FAE5', to: '#A7F3D0', icon: '#059669' },
  { from: '#FCE7F3', to: '#FBCFE8', icon: '#DB2777' },
  { from: '#E0E7FF', to: '#C7D2FE', icon: '#4F46E5' },
]

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

function BookListPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const pendingCart = usePendingCartStore((state) => state.pendingCart)
  const setPendingCart = usePendingCartStore((state) => state.setPendingCart)
  const clearPendingCart = usePendingCartStore((state) => state.clearPendingCart)
  const title = CATEGORY_TITLES[category]

  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [keywordInput, setKeywordInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [prevCategory, setPrevCategory] = useState(category)
  const [books, setBooks] = useState([])
  const [pageInfo, setPageInfo] = useState({ nowPageNum: 1, totalRows: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [completeModalOpen, setCompleteModalOpen] = useState(false)

  if (prevCategory !== category) {
    setPrevCategory(category)
    setPage(1)
    setKeywordInput('')
    setKeyword('')
  }

  const handleSizeChange = (newSize) => {
    setSize(newSize)
    setPage(1)
    setSizeOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setKeyword(keywordInput.trim())
    setPage(1)
  }

  useEffect(() => {
    if (!title) return undefined
    let cancelled = false
    const load = async () => {
      try {
        const result = await fetchBooks({ category, page, size, keyword })
        if (cancelled) return
        setBooks(result?.data ?? [])
        setPageInfo(
          result?.pageInfo ?? { nowPageNum: page, totalRows: 0 },
        )
        setError(null)
        setLoading(false)
      } catch (e) {
        if (cancelled) return
        setError(e)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [category, page, size, keyword, title])

  const registerCart = async (payload) => {
    try {
      const result = await addCart(payload)
      if (result?.code === 200) {
        setCompleteModalOpen(true)
      } else {
        alert(result?.message || '장바구니 등록이 실패되었습니다.')
      }
    } catch (e) {
      alert(e?.response?.data?.message || '장바구니 등록이 실패되었습니다.')
    }
  }

  const handleAddToCart = (book) => {
    const payload = { bookId: book.bookId, quantity: 1 }
    if (!isAuthenticated) {
      setPendingCart({
        ...payload,
        from: { pathname: location.pathname, search: location.search },
      })
      setLoginModalOpen(true)
      return
    }
    registerCart(payload)
  }

  useEffect(() => {
    if (!isAuthenticated || !pendingCart) return
    if (pendingCart.from?.pathname !== location.pathname) return
    const payload = { bookId: pendingCart.bookId, quantity: pendingCart.quantity }
    clearPendingCart()
    registerCart(payload)
  }, [isAuthenticated, pendingCart, location.pathname, clearPendingCart])

  const totalRows = pageInfo?.totalRows ?? 0
  const totalPages = Math.max(1, Math.ceil(totalRows / size))

  const pageNumbers = useMemo(() => {
    const window = 5
    if (totalPages <= window) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    let start = Math.max(1, page - 2)
    const end = Math.min(totalPages, start + window - 1)
    start = Math.max(1, end - window + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [page, totalPages])

  if (!title) {
    return (
      <div className="py-16 text-center text-red-500">
        존재하지 않는 카테고리입니다.
      </div>
    )
  }

  const startIndex = (page - 1) * size

  return (
    <div className="flex flex-col bg-[#F9FAFB]">
      {/* ── List Header ─────────────────────────────────── */}
      <section className="bg-white border-b border-[#E5E7EB] px-20 pt-6 pb-5 flex flex-col gap-4">
        {/* Top Row: title */}
        <div className="flex items-center gap-3">
          <BookOpen className="text-[#2563EB]" size={24} strokeWidth={2} />
          <h1 className="text-[22px] font-bold text-[#1F2937]">{title}</h1>
          <span className="text-sm font-normal text-[#6B7280]">
            (총 {totalRows.toLocaleString()}권)
          </span>
        </div>

        {/* Search Row */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex justify-center"
        >
          <div className="flex items-center w-full max-w-[490px]">
            <div className="flex items-center gap-2 px-4 py-2.5 w-[400px] rounded-l-lg border border-[#D1D5DB] border-r-0 bg-white">
              <Search size={18} className="text-[#9CA3AF]" strokeWidth={2} />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="도서명, 저자명으로 검색"
                className="flex-1 min-w-0 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-r-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              검색
            </button>
          </div>
        </form>

        {/* Bottom Row: per-page selector */}
        <div className="flex justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSizeOpen((v) => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md border border-[#D1D5DB] bg-white text-[13px] font-medium text-[#374151] hover:bg-gray-50 transition-colors"
            >
              <span>{size}개씩 보기</span>
              <ChevronDown
                size={14}
                className={`text-[#6B7280] transition-transform ${
                  sizeOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>
            {sizeOpen && (
              <ul className="absolute right-0 top-[calc(100%+2px)] w-[120px] rounded-md border border-[#E5E7EB] bg-white shadow-lg z-10 overflow-hidden">
                {PAGE_SIZE_OPTIONS.map((opt) => {
                  const active = opt === size
                  return (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => handleSizeChange(opt)}
                        className={`w-full text-left px-3.5 py-2 text-[13px] transition-colors ${
                          active
                            ? 'bg-[#EFF6FF] text-[#2563EB] font-medium'
                            : 'text-[#374151] hover:bg-gray-50'
                        }`}
                      >
                        {opt}개씩 보기
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ── Book List ───────────────────────────────────── */}
      <section className="bg-white px-20">
        {loading ? (
          <div className="py-16 text-center text-gray-500">불러오는 중...</div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">
            도서 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
          </div>
        ) : books.length === 0 ? (
          <div className="py-16 text-center text-[#9CA3AF] text-[15px]">
            표시할 도서가 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col">
            {books.map((book, idx) => {
              const theme = COVER_THEMES[idx % COVER_THEMES.length]
              return (
                <li
                  key={book.bookId}
                  className="py-5 border-b border-[#F3F4F6] flex items-center justify-between"
                >
                  <Link
                    to={`/book/${book.bookId}`}
                    className="flex items-center gap-5 min-w-0 flex-1"
                  >
                    <span className="w-6 text-center text-[16px] font-bold text-[#2563EB] flex-shrink-0">
                      {startIndex + idx + 1}
                    </span>
                    <div
                      className="w-16 h-[90px] rounded-md flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{
                        background: `linear-gradient(180deg, ${theme.from} 0%, ${theme.to} 100%)`,
                      }}
                    >
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen
                          size={24}
                          strokeWidth={2}
                          style={{ color: theme.icon }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#1F2937] truncate">
                        {book.title}
                      </h3>
                      {book.subtitle && (
                        <p className="text-[13px] font-normal text-[#9CA3AF] truncate">
                          {book.subtitle}
                        </p>
                      )}
                      <p className="text-[13px] font-normal text-[#6B7280] truncate">
                        {book.author}
                        {book.publishDate && (
                          <span className="text-[#9CA3AF]">
                            {' · '}
                            {formatDate(book.publishDate)}
                          </span>
                        )}
                      </p>
                      <p className="text-sm font-bold text-[#2563EB]">
                        {formatPrice(book.price)}원
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        navigate('/order', {
                          state: {
                            books: [{ bookId: book.bookId, quantity: 1 }],
                          },
                        })
                      }
                      className="px-5 py-2 rounded-md bg-[#2563EB] text-white text-[13px] font-medium hover:bg-blue-700 transition-colors"
                    >
                      주문하기
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(book)}
                      className="px-5 py-2 rounded-md border border-[#D1D5DB] bg-white text-[#374151] text-[13px] font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingCart size={14} strokeWidth={2} />
                      장바구니
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ── Pagination ──────────────────────────────────── */}
      {!loading && !error && totalPages > 1 && (
        <section className="bg-white px-20 pt-6 pb-8 flex items-center justify-center">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#374151] disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            {pageNumbers.map((p) => {
              const active = p === page
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-[#2563EB] text-white font-semibold'
                      : 'border border-[#D1D5DB] text-[#374151] font-medium hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D1D5DB] text-[#374151] disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </section>
      )}

      <ConfirmModal
        open={loginModalOpen}
        message={'해당기능은 로그인이 필요합니다.\n로그인하시겠습니까?'}
        confirmText="예"
        cancelText="아니오"
        onConfirm={() => {
          setLoginModalOpen(false)
          navigate('/login', {
            state: {
              from: {
                pathname: location.pathname,
                search: location.search,
              },
            },
          })
        }}
        onCancel={() => {
          setLoginModalOpen(false)
          clearPendingCart()
        }}
      />

      <ConfirmModal
        open={completeModalOpen}
        message={'장바구니에 등록되었습니다.\n장바구니로 이동하시겠습니까?'}
        confirmText="이동"
        cancelText="쇼핑계속하기"
        onConfirm={() => {
          setCompleteModalOpen(false)
          navigate('/cart')
        }}
        onCancel={() => setCompleteModalOpen(false)}
      />
    </div>
  )
}

export default BookListPage
