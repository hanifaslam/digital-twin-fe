'use client'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { MenuItem } from '@/types/layout-types'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import SidebarHeader from './sidebar-header'

import { useMenu } from '@/components/providers/menu-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useSidebarStore } from '@/store/use-sidebar-store'

const SidebarItem: React.FC<{
  item: MenuItem
  isCollapsed: boolean
  level?: number
}> = ({ item, isCollapsed, level = 0 }) => {
  const pathname = usePathname()
  const openMenus = useSidebarStore((state) => state.openMenus)
  const toggleMenu = useSidebarStore((state) => state.toggleMenu)
  const setMenuOpen = useSidebarStore((state) => state.setMenuOpen)
  const hasChildren = item.children && item.children.length > 0

  const normalize = (p?: string) => {
    if (!p) return ''
    const clean = p.split(/[?#]/)[0]
    if (clean === '/') return '/'
    return clean.replace(/\/+$/g, '')
  }

  const getPathWithoutLocale = (p: string) => {
    const parts = p.split('/').filter(Boolean)
    if (parts.length > 0 && (parts[0] === 'en' || parts[0] === 'id')) {
      return '/' + parts.slice(1).join('/')
    }
    return p
  }

  const path = normalize(pathname)

  const isHrefActive = (href?: string) => {
    if (!href) return false
    const h = normalize(href)
    if (!h) return false
    const pathNoLocale = getPathWithoutLocale(path)
    const hrefNoLocale = getPathWithoutLocale(h)
    if (hrefNoLocale === '/' || hrefNoLocale === '/dashboard') {
      return pathNoLocale === hrefNoLocale
    }

    return (
      pathNoLocale === hrefNoLocale ||
      pathNoLocale.startsWith(hrefNoLocale + '/')
    )
  }

  const isAnyChildActive = (children?: MenuItem[]): boolean => {
    if (!children || children.length === 0) return false
    return children.some(
      (c) => isHrefActive(c.href) || isAnyChildActive(c.children)
    )
  }

  const isActive = Boolean(item.href && !hasChildren && isHrefActive(item.href))

  const shouldAutoExpand = hasChildren && isAnyChildActive(item.children)
  const isExpanded = openMenus.includes(item.id)

  React.useEffect(() => {
    if (shouldAutoExpand) {
      setMenuOpen(item.id, true)
    }
  }, [shouldAutoExpand, item.id, setMenuOpen])

  if (item.id === 'separator') {
    return <Separator className="my-2" />
  }

  if (item.id === 'label-super-admin') {
    return (
      <div className="text-xs text-gray-500 uppercase font-semibold px-4 py-2">
        {item.label}
      </div>
    )
  }

  const handleClick = () => {
    if (hasChildren) {
      toggleMenu(item.id)
    } else if (item.href) {
      return
    }
  }

  const buttonContent = (
    <>
      <div
        className={cn(
          'flex items-center text-start overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'gap-0' : 'gap-3'
        )}
      >
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <span
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden',
            isCollapsed
              ? 'max-w-0 opacity-0 -translate-x-4 whitespace-nowrap'
              : 'max-w-[240px] opacity-100 translate-x-0 whitespace-normal wrap-break-word'
          )}
        >
          {item.label}
        </span>
      </div>
      {hasChildren && (
        <ChevronRight
          className={cn(
            'h-4 transition-all duration-300 shrink-0',
            isExpanded && 'rotate-90',
            isCollapsed ? 'w-0 opacity-0' : 'w-4 opacity-100'
          )}
        />
      )}
    </>
  )

  const buttonClasses = cn(
    'w-full flex items-center rounded-lg transition-all duration-300 mb-1',
    isCollapsed ? 'justify-between px-3 py-3' : 'justify-between px-4 py-3',
    'text-base font-medium',
    isActive
      ? 'dark:text-white text-primary bg-primary/10 font-semibold'
      : 'text-gray-700 dark:text-white hover:text-primary hover:bg-primary/10 font-semibold',
    level > 0 && !isCollapsed && 'text-base py-2 pl-13'
  )

  if (isCollapsed && level > 0) {
    return null
  }

  const buttonElement =
    item.href && !hasChildren ? (
      <Link href={item.href} className={buttonClasses}>
        {buttonContent}
      </Link>
    ) : (
      <button onClick={handleClick} className={buttonClasses}>
        {buttonContent}
      </button>
    )

  return (
    <div>
      {isCollapsed && level === 0 ? (
        hasChildren ? (
          <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger asChild>{buttonElement}</HoverCardTrigger>
            <HoverCardContent side="right" align="start" sideOffset={12} className="w-auto p-2">
              <div className="flex min-w-48 flex-col gap-1">
                {item.children?.map((child) => {
                  const childIsActive = Boolean(
                    child.href && isHrefActive(child.href)
                  )
                  return child.href ? (
                    <Link
                      key={child.id}
                      href={child.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                        childIsActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 dark:text-white hover:text-primary hover:bg-primary/10'
                      )}
                    >
                      <span>{child.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={child.id}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-primary hover:bg-primary/10'
                      )}
                    >
                      <span>{child.label}</span>
                    </button>
                  )
                })}
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-semibold">{item.label}</p>
            </TooltipContent>
          </Tooltip>
        )
      ) : (
        buttonElement
      )}

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          !isCollapsed && hasChildren
            ? isExpanded
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0'
            : 'max-h-0 opacity-0'
        )}
        style={{
          transitionProperty: 'max-height, opacity'
        }}
      >
        {!isCollapsed && hasChildren && (
          <div className="space-y-1">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                isCollapsed={isCollapsed}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Sidebar: React.FC = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen)
  const hasHydrated = useSidebarStore((state) => state.hasHydrated)
  const { filteredMenuItems } = useMenu()

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !hasHydrated) {
    return (
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full transition-all duration-300 ease-in-out',
          'bg-background border-r w-72 lg:translate-x-0 -translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader />
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-full transition-all duration-300 ease-in-out',
        'bg-background border-r',
        isCollapsed ? 'w-16' : 'w-72',
        'lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex h-full flex-col">
        <SidebarHeader />

        <ScrollArea
          className={cn(
            'flex-1 h-0 pb-6 transition-all duration-300 ease-in-out',
            isCollapsed ? 'px-2 py-6' : 'px-4'
          )}
        >
          <div className="space-y-1">
            {filteredMenuItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}

export default Sidebar
