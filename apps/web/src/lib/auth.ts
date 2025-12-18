import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  robloxUserId: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  planTier: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      logout: async () => {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          })
        } catch (e) {}
        set({ user: null, token: null })
      },

      fetchUser: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (res.ok) {
            const data = await res.json()
            set({ user: data.user, isLoading: false })
          } else {
            set({ user: null, token: null, isLoading: false })
          }
        } catch (e) {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'rocode-auth',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.fetchUser()
      },
    }
  )
)

