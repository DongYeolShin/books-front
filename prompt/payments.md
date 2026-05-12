# 포트원 V2 일반결제 - OrderPage 통합

## 컨텍스트
기존 `src/pages/OrderPage.jsx`에 포트원 V2 결제를 추가합니다. 페이지에는 이미 폼/포인트/금액 계산이 구현되어 있고, `handlePay()`만 alert로 끝나 있는 상태입니다. 웹훅은 사용하지 않습니다.

## 결제 흐름
```
폼 작성 → 결제하기 클릭
  → POST /api/v1/orders (서버가 orderId 발급)
  → PortOne.requestPayment() (paymentId = orderId)
  → 결제창에서 결제
  → POST /api/v1/payments/complete (서버 검증)
  → 서버에서 데이터 받은 후 
  -> 결제 결과 페이지로 이동 (성공 또는 실패 표시)
  -> 결제 결과페이지에는 메인화면 이동 버튼 추가 
```

## 환경
- 기존 스택: React 18, React Router v6, Zustand, Tailwind
- 추가: `npm install @portone/browser-sdk`
- `.env`:
  ```
  VITE_PORTONE_STORE_ID=store-xxxxxxxx
  VITE_PORTONE_CHANNEL_KEY=channel-key-xxxxxxxx
  ```

## 구현

### 1. `src/services/paymentService.js` (신규)
기존 `orderService.js`와 동일한 HTTP 클라이언트 패턴 사용.
```javascript
// createOrder(req): POST /api/v1/orders
//   req: { receiver, phone, shippingAddress, shippingDetailAddress,
//          usedPoints, items: [{ bookId, quantity, priceAtPurchase }] }
//   res: { orderId, totalAmount, orderName }

// completePayment({ paymentId, orderId }): POST /api/v1/payments/complete
//   res: { status: "PAID"|"FAILED"|"VIRTUAL_ACCOUNT_ISSUED", paymentId, message }
```

### 2. `src/utils/portone.js` (신규)
```javascript
import * as PortOne from '@portone/browser-sdk/v2'

export const requestPortOnePayment = async ({
  orderId, orderName, totalAmount, payMethod = 'CARD', customer,
}) => {
  const response = await PortOne.requestPayment({
    storeId: import.meta.env.VITE_PORTONE_STORE_ID,
    channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
    paymentId: orderId,        // ★ orderId와 동일
    orderName,
    totalAmount,
    currency: 'CURRENCY_KRW',
    payMethod,
    customer: {
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
    },
  })
  if (response?.code != null) {
    return { success: false, code: response.code, message: response.message }
  }
  return { success: true, paymentId: orderId }
}
```

### 3. `OrderPage.jsx` 수정
- import 추가:
  ```javascript
  import { createOrder, completePayment } from '../services/paymentService'
  import { requestPortOnePayment } from '../utils/portone'
  ```
- state 추가: `const [isProcessing, setIsProcessing] = useState(false)`
- `handlePay`를 아래로 교체 (기존 유효성 검사 유지):
  ```javascript
  const handlePay = async () => {
    if (!recipient.trim()) return alert('수령인을 입력하세요.')
    if (!phone.trim()) return alert('연락처를 입력하세요.')
    if (!zipcode || !address) return alert('주소를 검색해 입력하세요.')
    if (!detailAddress.trim()) return alert('상세 주소를 입력하세요.')
    if (isProcessing) return
    setIsProcessing(true)
    try {
      const orderRes = await createOrder({
        receiver: recipient,
        phone,
        shippingAddress: `[${zipcode}] ${address}`,
        shippingDetailAddress: detailAddress,
        usedPoints,
        items: orderBooks.map((b) => ({
          bookId: b.bookId,
          quantity: b.quantity,
          priceAtPurchase: b.salePrice ?? b.originalPrice,
        })),
      })
      const { orderId, totalAmount, orderName } = orderRes.data ?? orderRes

      const payResult = await requestPortOnePayment({
        orderId, orderName, totalAmount,
        payMethod: 'CARD',
        customer: { fullName: recipient, phoneNumber: phone },
      })
      if (!payResult.success) {
        navigate(`/payment/fail?orderId=${orderId}&message=${encodeURIComponent(payResult.message ?? '결제가 취소되었습니다.')}`)
        return
      }

      const completeRes = await completePayment({
        paymentId: payResult.paymentId, orderId,
      })
      const { status, message } = completeRes.data ?? completeRes
      if (status === 'PAID') {
        navigate(`/payment/success?orderId=${orderId}`)
      } else if (status === 'VIRTUAL_ACCOUNT_ISSUED') {
        navigate(`/payment/success?orderId=${orderId}&virtualAccount=true`)
      } else {
        navigate(`/payment/fail?orderId=${orderId}&message=${encodeURIComponent(message ?? '결제에 실패했습니다.')}`)
      }
    } catch (e) {
      console.error(e)
      alert(e?.response?.data?.message ?? '결제 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }
  ```
- 결제 버튼에 `disabled={isProcessing}` 추가, 텍스트는 `isProcessing ? '결제 진행 중...' : '결제하기'`

### 4. 결과 페이지 신규 작성
기존 OrderPage 디자인 톤(`bg-[#F5F5F8]`, 흰 카드, 파란 포인트) 유지.

- `src/pages/PaymentSuccessPage.jsx`
    - `useSearchParams`로 `orderId`, `virtualAccount` 읽기
    - 가상계좌 분기 안내
    - 버튼: 주문 내역 보기, 쇼핑 계속하기

- `src/pages/PaymentFailPage.jsx`
    - `useSearchParams`로 `orderId`, `message` 읽기
    - 버튼: 다시 시도하기(`navigate(-1)`), 홈으로

### 5. 라우터 등록
```javascript
<Route path="/payment/success" element={<PaymentSuccessPage />} />
<Route path="/payment/fail" element={<PaymentFailPage />} />
```

## 주의사항
- 포트원에 전달하는 `totalAmount`는 클라이언트의 `finalPrice`가 아닌 **서버 응답값** 사용.
- `paymentId === orderId` 규칙을 반드시 지킴.
- 결제 수단은 일단 `CARD` 고정. 추후 선택 UI 추가 시 인자로 가변화.
- `services/orderService.js`에서 사용하는 인증 헤더 방식을 `paymentService.js`에도 동일 적용.
- 기존 코드 컨벤션(작은따옴표, 세미콜론 생략) 유지.

