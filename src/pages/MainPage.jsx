import { useEffect, useState } from 'react'
import { fetchTopBooks } from '../services/bookService'
import BookSection from '../components/BookSection'

const SECTIONS = [
  { key: 'bestTopN', title: '베스트셀러 Top 5', category: 'bestSeller', moreVariant: 'plain' },
  { key: 'newTopN', title: '새로나온책 Top 5', category: 'new', moreVariant: 'plain' },
  { key: 'basicTopN', title: '기본서 Top 5', category: 'basic', moreVariant: 'outlined' },
]

const EMPTY_TOPS = { bestTopN: [], newTopN: [], basicTopN: [] }

function MainPage() {
  const [topBooks, setTopBooks] = useState(EMPTY_TOPS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const result = await fetchTopBooks()
        if (cancelled) return
        const data = result?.data ?? {}
        setTopBooks({
          bestTopN: data.bestTopN ?? [],
          newTopN: data.newTopN ?? [],
          basicTopN: data.basicTopN ?? [],
        })
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
  }, [])

  if (loading) {
    return <div className="py-16 text-center text-gray-500">불러오는 중...</div>
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-500">
        도서 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-14">
      {SECTIONS.map(({ key, title, category, moreVariant }) => (
        <BookSection
          key={key}
          title={title}
          category={category}
          moreVariant={moreVariant}
          books={topBooks[key]}
        />
      ))}
    </div>
  )
}

export default MainPage
