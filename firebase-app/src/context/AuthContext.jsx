import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
      setError(e)
      throw e
    }
  }, [])

  const register = useCallback(async (email, password) => {
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (e) {
      setError(e)
      throw e
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try {
      await signOut(auth)
    } catch (e) {
      setError(e)
      throw e
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      clearError,
      login,
      register,
      logout,
    }),
    [user, loading, error, clearError, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider')
  }
  return ctx
}
