import axiosInstance from '../apis/axiosInstance'
import { ENDPOINTS } from '../apis/endpoints'

export const createOrder = async (req) => {
  const { data } = await axiosInstance.post(ENDPOINTS.ORDERS, req)
  return data
}

export const completePayment = async ({ paymentId, orderId }) => {
  const { data } = await axiosInstance.post(ENDPOINTS.PAYMENTS_COMPLETE, {
    paymentId,
    orderId,
  })
  return data
}

export const fetchPaymentComplete = async (orderId) => {
  try {
    const { data } = await axiosInstance.get(ENDPOINTS.PAYMENTS_COMPLETE, {
      params: { orderId },
    })
    return data
  } catch (e) {
    const res = await fetch('/mocks/payment-complete.json')
    if (!res.ok) throw e
    const mock = await res.json()
    if (orderId && mock?.data) {
      mock.data.orderId = orderId
    }
    return mock
  }
}
