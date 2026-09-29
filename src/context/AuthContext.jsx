import { createContext, useContext, useState, useEffect } from 'react'
import { SESSION_EXPIRED_EVENT } from '@/services/apiClient'

export const SESSION_EXPIRED_FLAG = 'learnhub:session-expired'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore user on page refresh
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // token is optional so callers can refresh the stored user after a profile update
  const login = (userData, token) => {
    if (token) localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // The API rejected the stored token (it expired): sign out, and let the
  // login page explain why the person was sent there.
  useEffect(() => {
    const onExpired = () => {
      if (!localStorage.getItem('token')) return
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      try {
        sessionStorage.setItem(SESSION_EXPIRED_FLAG, '1')
      } catch {
        // Private mode: the banner is a nicety, signing out still happens.
      }
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}