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
