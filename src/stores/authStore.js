import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const initialState = {
  accessToken: '',
  tokenType: '',
  expiresIn: 0,
  userId: '',
  name: '',
}

const useAuthStore = create(
  persist(
    immer((set) => ({
      ...initialState,
      setAuth: (payload) =>
        set((state) => {
          state.accessToken = payload.accessToken ?? ''
          state.tokenType = payload.tokenType ?? 'Bearer'
          state.expiresIn = payload.expiresIn ?? 0
          state.userId = payload.userId ?? ''
          state.name = payload.name ?? ''
        }),
      clearAuth: () =>
        set((state) => {
          state.accessToken = initialState.accessToken
          state.tokenType = initialState.tokenType
          state.expiresIn = initialState.expiresIn
          state.userId = initialState.userId
          state.name = initialState.name
        }),
    })),
    {
      name: 'auth-storage',
    },
  ),
)

export const selectIsAuthenticated = (state) => Boolean(state.accessToken)

export default useAuthStore
