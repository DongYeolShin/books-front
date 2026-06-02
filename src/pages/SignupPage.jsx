import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './SignupPage.module.css'
import { signup, checkUserId } from '../services/authService'

const DAUM_POSTCODE_URL =
  '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

function loadDaumPostcode() {
  // Already loaded — resolve immediately
  if (window.daum?.Postcode) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = DAUM_POSTCODE_URL
    script.onload = resolve
    script.onerror = () => reject(new Error('Daum Postcode 스크립트 로드 실패'))
    document.head.appendChild(script)
  })
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const phonePrefixes = ['010', '011', '016', '017', '018', '019']

function SignupPage() {
  const [form, setForm] = useState({
    userId: '',
    email: '',
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: 'M',
    password: '',
    passwordConfirm: '',
    phonePrefix: '010',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
  })
  const [submitting, setSubmitting] = useState(false)
  // 필드별 검증 에러 메시지 { [fieldName]: message }
  const [errors, setErrors] = useState({})
  // null = 미확인, true = 사용 가능, false = 사용 불가
  const [idAvailable, setIdAvailable] = useState(null)
  const [idCheckMsg, setIdCheckMsg] = useState('')
  const [idChecking, setIdChecking] = useState(false)
  const addressDetailRef = useRef(null)
  const navigate = useNavigate()

  const clearError = (name) => {
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // 입력하면 해당 필드의 에러 메시지 제거
    clearError(name)
    // 생년월일 select들은 birthDate 에러 키를 공유
    if (name === 'birthYear' || name === 'birthMonth' || name === 'birthDay') {
      clearError('birthDate')
    }
    // 아이디를 변경하면 중복확인 결과를 초기화하여 재확인을 강제
    if (name === 'userId') {
      setIdAvailable(null)
      setIdCheckMsg('')
    }
  }

  const handleGender = (value) => {
    setForm((prev) => ({ ...prev, gender: value }))
  }

  const handleCheckId = async () => {
    if (idChecking) return
    if (!form.userId.trim()) {
      setIdAvailable(false)
      setIdCheckMsg('아이디를 입력해주세요.')
      return
    }

    setIdChecking(true)
    try {
      const data = await checkUserId(form.userId.trim())
      setIdAvailable(data.available)
      setIdCheckMsg(
        data.message ??
          (data.available ? '사용 가능한 아이디입니다' : '이미 사용 중인 아이디입니다')
      )
    } catch (error) {
      setIdAvailable(false)
      setIdCheckMsg(
        error.response?.data?.message || '아이디 확인 중 오류가 발생했습니다.'
      )
    } finally {
      setIdChecking(false)
    }
  }

  const handleAddressSearch = async () => {
    try {
      await loadDaumPostcode()
      new window.daum.Postcode({
        oncomplete(data) {
          const address =
            data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
          setForm((prev) => ({
            ...prev,
            zipcode: data.zonecode,
            address,
            addressDetail: '',
          }))
          clearError('address')
          // Move focus to 상세주소 after the postcode popup closes
          setTimeout(() => addressDetailRef.current?.focus(), 0)
        },
      }).open()
    } catch (err) {
      console.error(err)
      alert('주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  // Derived: true when the confirm field has content AND it doesn't match
  const passwordMismatch =
    form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm

  // Derived: true only when both fields are non-empty and identical
  const passwordMatch =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm

  // 필수값 검증 → { [field]: message } 형태의 에러 맵 반환 (비어있으면 통과)
  const validate = () => {
    const next = {}

    if (!form.userId.trim()) {
      next.userId = '아이디를 입력해주세요.'
    } else if (idAvailable !== true) {
      next.userId = '아이디 중복확인을 해주세요.'
    }

    if (!form.email.trim()) next.email = '이메일을 입력해주세요.'
    if (!form.name.trim()) next.name = '이름을 입력해주세요.'

    if (!form.birthYear || !form.birthMonth || !form.birthDay) {
      next.birthDate = '생년월일을 모두 선택해주세요.'
    }

    if (!form.password) {
      next.password = '패스워드를 입력해주세요.'
    }
    if (!form.passwordConfirm) {
      next.passwordConfirm = '패스워드 확인을 입력해주세요.'
    } else if (form.password !== form.passwordConfirm) {
      next.passwordConfirm = '패스워드가 일치하지 않습니다.'
    }

    if (!form.phone.trim()) next.phone = '핸드폰 번호를 입력해주세요.'

    if (!form.zipcode || !form.address) {
      next.address = '주소를 검색해주세요.'
    }

    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const birthDate = `${form.birthYear}-${String(form.birthMonth).padStart(2, '0')}-${String(form.birthDay).padStart(2, '0')}`
    const payload = {
      userId: form.userId,
      email: form.email,
      passwd: form.password,
      name: form.name,
      phone: `${form.phonePrefix}-${form.phone}`,
      gender: form.gender,
      birthDate,
      postalCode: form.zipcode,
      address: form.address,
      ...(form.addressDetail ? { addressDetail: form.addressDetail } : {}),
    }

    setSubmitting(true)
    try {
      const data = await signup(payload)
      alert(data.message ?? '회원가입이 완료되었습니다')
      navigate('/login')
    } catch (error) {
      alert(error.response?.data?.message || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">회원가입</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="userId" className="text-sm font-medium text-gray-700">
              아이디
            </label>
            <div className="flex gap-2">
              <input
                id="userId"
                name="userId"
                type="text"
                value={form.userId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                className={styles.input}
              />
              <button
                type="button"
                onClick={handleCheckId}
                disabled={idChecking}
                className={styles.checkButton}
              >
                {idChecking ? '확인 중...' : '중복확인'}
              </button>
            </div>
            {idCheckMsg && (
              <p
                className={
                  idAvailable
                    ? 'text-xs text-green-600 mt-0.5'
                    : 'text-xs text-red-500 mt-0.5'
                }
              >
                {idCheckMsg}
              </p>
            )}
            {!idCheckMsg && errors.userId && (
              <p className="text-xs text-red-500 mt-0.5">{errors.userId}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              className={styles.input}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              autoComplete="name"
              className={styles.input}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">생년월일</span>
            <div className="flex gap-2">
              <select
                name="birthYear"
                value={form.birthYear}
                onChange={handleChange}
                className={styles.select}
                aria-label="출생년도"
              >
                <option value="">년</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                name="birthMonth"
                value={form.birthMonth}
                onChange={handleChange}
                className={styles.select}
                aria-label="출생월"
              >
                <option value="">월</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                name="birthDay"
                value={form.birthDay}
                onChange={handleChange}
                className={styles.select}
                aria-label="출생일"
              >
                <option value="">일</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            {errors.birthDate && (
              <p className="text-xs text-red-500 mt-0.5">{errors.birthDate}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">성별</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleGender('M')}
                className={form.gender === 'M' ? styles.genderBtnActive : styles.genderBtn}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => handleGender('F')}
                className={form.gender === 'F' ? styles.genderBtnActive : styles.genderBtn}
              >
                여성
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              패스워드
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="8자 이상 입력"
              autoComplete="new-password"
              className={styles.input}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700">
              패스워드 확인
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="패스워드를 다시 입력하세요"
              autoComplete="new-password"
              className={styles.input}
            />
            {passwordMismatch && (
              <p className="text-xs text-red-500 mt-0.5">패스워드가 일치하지 않습니다.</p>
            )}
            {passwordMatch && (
              <p className="text-xs text-green-600 mt-0.5">패스워드가 일치합니다.</p>
            )}
            {!passwordMismatch && !passwordMatch && errors.passwordConfirm && (
              <p className="text-xs text-red-500 mt-0.5">{errors.passwordConfirm}</p>
            )}
          </div>

          <hr className="border-gray-200 my-2" />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">핸드폰 번호</span>
            <div className="flex gap-2">
              <select
                name="phonePrefix"
                value={form.phonePrefix}
                onChange={handleChange}
                className={styles.select}
                aria-label="통신사 번호 앞자리"
              >
                {phonePrefixes.map((prefix) => (
                  <option key={prefix} value={prefix}>
                    {prefix}
                  </option>
                ))}
              </select>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="번호를 입력하세요"
                className={styles.input}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>
            )}
          </div>

          {form.zipcode && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">우편번호</span>
              <input
                type="text"
                value={form.zipcode}
                readOnly
                className={`${styles.input} ${styles.zipcode}`}
                aria-label="우편번호"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">
              주소
            </label>
            <div className="flex gap-2">
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                readOnly
                placeholder="주소 검색을 클릭하세요"
                className={styles.input}
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className={styles.addressButton}
              >
                주소 검색
              </button>
            </div>
            {errors.address && (
              <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="addressDetail" className="text-sm font-medium text-gray-700">
              상세주소
            </label>
            <input
              ref={addressDetailRef}
              id="addressDetail"
              name="addressDetail"
              type="text"
              value={form.addressDetail}
              onChange={handleChange}
              placeholder="상세주소를 입력하세요"
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting || passwordMismatch}
          >
            {submitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:text-purple-700">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
