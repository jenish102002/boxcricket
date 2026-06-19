import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (token, user) => set({ token, user }),

      logout: () => {
        set({ token: null, user: null })
        // Clear any pending query cache
        window.dispatchEvent(new CustomEvent('auth:logout'))
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'boxcricket-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
