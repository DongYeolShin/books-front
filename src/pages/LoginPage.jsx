import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import styles from './LoginPage.module.css'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: 실제 로그인 API 연동
    console.log('login submit', form)
  }

  const handleSignup = () => {
    navigate('/signup')
  }

  return (
    <div className={`${styles.page} min-h-screen w-full flex items-center justify-center px-4`}>
      <div className={`${styles.card} w-full max-w-md bg-white rounded-2xl shadow-xl p-10`}>
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <BookOpen className="text-purple-600" size={32} strokeWidth={2} />
          <span className="text-2xl font-bold text-gray-800 tracking-tight">북스토어</span>
        </Link>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              className={styles.input}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              className={styles.input}
              required
            />
          </div>

          <div className="flex flex-row gap-3 mt-4">
            <button type="submit" className={styles.loginButton}>
              로그인
            </button>
            <button
              type="button"
              onClick={handleSignup}
              className={styles.signupButton}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
