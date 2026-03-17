'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuthStore from '../../store/auth-store'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (hasHydrated) {
      if (isAuthenticated) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }
  }, [isAuthenticated, hasHydrated, router])

  return null
}
