import { useNavigate, useSearchParams } from 'react-router-dom'
import { XCircle } from 'lucide-react'

function PaymentFailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId') ?? ''
  const message = searchParams.get('message') ?? '결제에 실패했습니다.'

  return (
    <div className="min-h-screen bg-[#F5F5F8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
          <XCircle size={36} className="text-[#EF4444]" strokeWidth={2} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[24px] font-bold text-[#1F2937]">결제에 실패했습니다</h1>
          <p className="text-sm text-[#6B7280] text-center whitespace-pre-wrap">
            {message}
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
            onClick={() => navigate(-1)}
            className="flex-1 h-12 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold text-[#374151] hover:bg-[#F5F5F5] transition-colors"
          >
            다시 시도하기
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 h-12 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailPage
