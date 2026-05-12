import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const usePendingCartStore = create(
  persist(
    immer((set) => ({
      pendingCart: null,
      setPendingCart: (payload) =>
        set((state) => {
          state.pendingCart = payload
        }),
      clearPendingCart: () =>
        set((state) => {
          state.pendingCart = null
        }),
    })),
    {
      name: 'pending-cart-storage',
    },
  ),
)

export default usePendingCartStore
