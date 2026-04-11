'use client'

import {
  extractHrefAndMiddleware,
  useMenuItems
} from '@/components/navigation/sidebar/sidebar-menu'
import { filterMenuItemsByAccess } from '@/lib/access-control'
import { authEvents } from '@/lib/auth-event'
import { me } from '@/service/auth/auth-service'
import { MenuItem } from '@/types/layout-types'
import { Access } from '@/types/response/auth/auth-response'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useAuthStore from '../store/auth-store'

interface UseAuthGuardReturn {
  isLoading: boolean
  isAuthenticated: boolean
  filteredMenuItems: MenuItem[]
  error: { status: number; message: string } | null
}

const flattenAccess = (accessList: Access[]): string[] => {
  const codes: string[] = []
  const traverse = (list: Access[]) => {
    for (const access of list) {
      if (access.code) codes.push(access.code)
      if (access.children) traverse(access.children)
    }
  }
  traverse(accessList)
  return codes
}

export function useAuthGuard(): UseAuthGuardReturn {
  const router = useRouter()
  const { isAuthenticated, logout, setUser, hasHydrated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)
  const [error, setError] = useState<{
    status: number
    message: string
  } | null>(null)
  const menuItems = useMenuItems()
  const [filteredMenuItems, setFilteredMenuItems] =
    useState<MenuItem[]>(menuItems)
  const path = usePathname()

  useEffect(() => {
    const off = authEvents.onUnauthorized(() => {
      if (!window.location.pathname.startsWith('/login')) {
        logout()
        router.replace('/login')
      }
    })
    return () => {
      off()
    }
  }, [logout, router])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!hasHydrated) {
          return
        }

        if (!isAuthenticated) {
          router.replace('/login')
          setIsLoading(false)
          return
        }

        const response = await me()
        const accesses =
          response.success && response.data
            ? flattenAccess(response.data.access)
            : []

        const filteredItems = filterMenuItemsByAccess(menuItems, accesses)
        setFilteredMenuItems(filteredItems)

        const pathAccess = extractHrefAndMiddleware(menuItems)

        if (pathAccess.length > 0) {
          const filteredItems = filterMenuItemsByAccess(menuItems, accesses)
          const flatFilteredItems = filteredItems.flatMap((item) => {
            const childHrefs = item.children
              ? item.children.map((child) => child.href).filter(Boolean)
              : []
            return [item.href, ...childHrefs].filter(Boolean)
          })

          const currentPathAccess = pathAccess.find((pa) => pa.href === path)
          if (
            currentPathAccess &&
            !flatFilteredItems.includes(currentPathAccess.href)
          ) {
            setHasAccess(false)
            router.replace('/dashboard')
            return
          }
        }

        if (response.data) {
          setUser({
            id: response.data.id,
            username: response.data.username,
            name: response.data.name,
            email: response.data.email,
            role_id: response.data.role_id,
            role_name: response.data.role_name,
            role_code: response.data.role_code,
            nip: response.data.nip,
            lecturer_id: response.data.lecturer_id,
            study_programs: response.data.study_programs || [],
            buildings: response.data.buildings || [],
            access: response.data.access || null
          })
          setHasAccess(true)
        }
      } catch (error: unknown) {
        const axiosError = error as {
          response?: { status?: number }
          code?: string
        }
        if (axiosError.response?.status === 500) {
          setError({ status: 500, message: 'Internal Server Error' })
        } else if (
          axiosError.response?.status === 401 ||
          axiosError.code === 'UNAUTHORIZED'
        ) {
          logout()
          router.replace('/login')
          return
        } else {
          console.error('Auth check failed:', error)
        }
      } finally {
        if (hasHydrated) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, router, logout, setUser, hasHydrated, path, menuItems])

  return {
    isLoading: isLoading || !hasHydrated,
    isAuthenticated: isAuthenticated && hasHydrated && !isLoading && hasAccess,
    filteredMenuItems,
    error
  }
}
