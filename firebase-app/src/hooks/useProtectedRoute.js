import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  return useMemo(
    () => ({
      isLoading: loading,
      isAuthenticated: Boolean(user),
      redirectTo: '/login',
      state: { from: location },
    }),
    [user, loading, location]
  )
}
