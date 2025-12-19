'use client'
import { useRef, useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { makeStore } from '../lib/store'
import { loginSuccess } from '../lib/features/login/authSlice'
import { forceClearInvalidCart, recalculateTotal } from '../lib/features/cart/cartSlice'

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

// Component to clean up invalid cart data on app initialization
// This must be inside the Provider to use useDispatch
function CartCleaner() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Clean up cart immediately on app load
    if (typeof window !== 'undefined') {
      // Force clear any invalid cart data and recalculate
      dispatch(forceClearInvalidCart())
      dispatch(recalculateTotal())
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
      <CartCleaner />
      {children}
    </Provider>
  )
}