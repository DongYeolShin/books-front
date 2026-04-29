import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import BookCard from './BookCard'

function BookSection({ title, category, moreVariant = 'plain', books = [] }) {
  const moreClass =
    moreVariant === 'outlined'
      ? 'inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors'
      : 'inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors'

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Link to={`/books?category=${category}`} className={moreClass}>
          <span>더보기</span>
          <ChevronRight size={16} />
        </Link>
      </header>
      {books.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400">표시할 도서가 없습니다.</div>
      ) : (
        <div className="flex gap-5">
          {books.map((book, i) => (
            <BookCard key={book.bookId ?? `${title}-${i}`} book={book} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

export default BookSection
