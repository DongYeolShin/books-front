import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const COVER_THEMES = [
  { gradient: 'from-blue-100 to-blue-200', icon: 'text-blue-500' },
  { gradient: 'from-amber-100 to-amber-200', icon: 'text-amber-600' },
  { gradient: 'from-emerald-100 to-emerald-200', icon: 'text-emerald-600' },
  { gradient: 'from-pink-100 to-pink-200', icon: 'text-pink-600' },
  { gradient: 'from-indigo-100 to-indigo-200', icon: 'text-indigo-600' },
]

function BookCard({ book, index = 0 }) {
  const theme = COVER_THEMES[index % COVER_THEMES.length]
  const price = typeof book.price === 'number' ? book.price.toLocaleString() : book.price

  return (
    <Link
      to={`/books/${book.bookId}`}
      className="flex-1 min-w-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div
        className={`relative h-[220px] bg-gradient-to-b ${theme.gradient} flex items-center justify-center`}
      >
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className={theme.icon} size={40} strokeWidth={2} />
        )}
      </div>
      <div className="p-3 flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{book.title}</h3>
        <p className="text-[13px] text-gray-500 truncate">{book.author}</p>
        <p className="text-sm font-bold text-blue-600">{price}원</p>
      </div>
    </Link>
  )
}

export default BookCard
