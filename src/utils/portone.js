import * as PortOne from '@portone/browser-sdk/v2'

export const requestPortOnePayment = async ({
  orderId,
  orderName,
  totalAmount,
  payMethod = 'CARD',
  customer,
}) => {
  const response = await PortOne.requestPayment({
    storeId: import.meta.env.VITE_PORTONE_STORE_ID,
    channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
    paymentId: orderId,
    orderName,
    totalAmount,
    payMethod,
    currency: 'CURRENCY_KRW',
    customer: {
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      email: 'admin@naver.com',
    },
  })
  if (response?.code != null) {
    return { success: false, code: response.code, message: response.message }
  }
  return { success: true, paymentId: orderId }
}
