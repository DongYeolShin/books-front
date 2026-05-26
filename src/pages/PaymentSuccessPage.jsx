import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

function PaymentSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId') ?? ''
  const isVirtualAccount = searchParams.get('virtualAccount') === 'true'

  useEffect(() => {
    if (!orderId || isVirtualAccount) return
    navigate(`/order/complete?orderId=${orderId}`, { replace: true })
  }, [orderId, isVirtualAccount, navigate])

  return (
    <div className="min-h-screen bg-[#F5F5F8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center">
          <CheckCircle2 size={36} className="text-[#2563EB]" strokeWidth={2} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[24px] font-bold text-[#1F2937]">
            {isVirtualAccount ? '가상계좌가 발급되었습니다' : '결제가 완료되었습니다'}
          </h1>
          <p className="text-sm text-[#6B7280] text-center">
            {isVirtualAccount
              ? '입금 안내에 따라 지정된 계좌로 입금하시면 주문이 완료됩니다.'
              : '주문이 정상적으로 접수되었습니다.'}
          </p>
        </div>

        {orderId && (
          <div className="w-full bg-[#F9FAFB] rounded-lg px-5 py-4 flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">주문번호</span>
            <span className="text-[13px] font-semibold text-[#1F2937]">
              {orderId}
            </span>
          </div>
        )}

        <div className="w-full flex gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 h-12 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold text-[#374151] hover:bg-[#F5F5F5] transition-colors"
          >
            쇼핑 계속하기
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 h-12 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-colors"
          >
            주문 내역 보기
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm text-[#6B7280] hover:text-[#1F2937] underline"
        >
          메인 화면으로 이동
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
