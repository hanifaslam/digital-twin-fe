'use client'

import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/store/use-sidebar-store'
import { BreadcrumbItems } from '@/types/layout-types'
import { usePathname } from 'next/navigation'
import React from 'react'
import Headers from '../navigation/header/header'
import Sidebar from '../navigation/sidebar/sidebar'

import { TooltipProvider } from '../ui/tooltip'

interface MainLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItems[]
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  breadcrumbs = []
}) => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen)
  const isHidden = useSidebarStore((state) => state.isHidden)
  const hasHydrated = useSidebarStore((state) => state.hasHydrated)
  const setIsMobileOpen = useSidebarStore((state) => state.setIsMobileOpen)
  const setIsHidden = useSidebarStore((state) => state.setIsHidden)
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed)

  const pathname = usePathname()

  const date = new Date().getFullYear()

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const isCalendarPage = pathname.match(
      /\/(en|id)\/dashboard\/rates-and-availability\/calendar/
    )
    const isDashboardPage = pathname.match(/^\/(en|id)\/dashboard$/)

    setIsMobileOpen(false)
    setIsHidden(!!isCalendarPage)

    if (isDashboardPage) {
      setIsCollapsed(true)
    } else {
      setIsCollapsed(false)
    }
  }, [pathname, setIsMobileOpen, setIsHidden, setIsCollapsed])

  const effectiveCollapsed = mounted && hasHydrated ? isCollapsed : false

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
        {/* Sidebar */}
        {!isHidden && <Sidebar />}

        {/* Mobile Sidebar Overlay */}
        {!isHidden && isMobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <div
          className={cn(
            'flex flex-col h-screen transition-all duration-300 ease-in-out',
            isHidden
              ? 'lg:ml-0 overflow-x-hidden'
              : effectiveCollapsed
                ? 'lg:ml-16'
                : 'lg:ml-72'
          )}
        >
          {!isHidden && <Headers breadcrumbs={breadcrumbs} />}

          <main
            className={cn(
              'flex-1 overflow-y-auto pb-10',
              isHidden && 'pb-0 overflow-x-hidden'
            )}
          >
            {children}
          </main>
        </div>

        {!isHidden && (
          <footer
            className={cn(
              'border-border fixed right-0 bottom-0 left-0 z-50 border-t bg-card py-4',
              effectiveCollapsed ? 'lg:left-16' : 'lg:left-72'
            )}
          >
            <div className="flex items-center justify-between px-6">
              <span className="text-muted-foreground">
                <span className="text-foreground">Copyright ©</span> {date}{' '}
                Property Management System
              </span>
              <span className="text-muted-foreground">
                <span>Powered by </span>
                <span className="text-primary font-medium">Rapier</span>
              </span>
            </div>
          </footer>
        )}
      </div>
    </TooltipProvider>
  )
}
