'use client'
import { useRef, useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { makeStore } from '../lib/store'
import { loginSuccess } from '../lib/features/login/authSlice'

// Component to restore auth state from localStorage
// This must be inside the Provider to use useDispatch
function AuthRestorer() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Restore auth state from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          const user = JSON.parse(userStr)
          if (user && user.email) {
            // Dispatch loginSuccess to restore auth state
            dispatch(loginSuccess({ email: user.email, ...user }))
          }
        }
      } catch (error) {
        console.error('Error restoring auth state:', error)
      }
    }
  }, [dispatch])

  return null
}

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <AuthRestorer />
      {children}
    </Provider>
  )
}