import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-6">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-indigo-600 hover:underline">
        홈으로 돌아가기
      </Link>
    </section>
  )
}

export default NotFoundPage
