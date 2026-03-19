import ImageLoader from '@/components/wrappers/image-loader'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/store/use-sidebar-store'
import Link from 'next/link'
import React from 'react'

const SidebarHeader: React.FC = () => {
  const { isCollapsed } = useSidebarStore()
  return (
    <div
      className={cn(
        'flex items-center transition-all duration-300 ease-in-out',
        isCollapsed
          ? 'h-12 px-4 pt-8 pb-2 justify-center'
          : 'h-32 px-4 pt-2 pb-2 justify-start'
      )}
    >
      <Link
        href="/dashboard"
        className={cn(
          'flex items-center transition-all duration-300 ease-in-out',
          isCollapsed ? 'gap-0' : 'gap-2'
        )}
        draggable={false}
      >
        <div
          className={cn(
            'flex items-center justify-center transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-12' : 'w-16'
          )}
        >
          <div className="dark:hidden w-full">
            <ImageLoader
              src="/logo.png"
              alt="Logo"
              width={128}
              height={128}
              className="object-contain w-full h-auto"
              draggable={false}
              loading="eager"
            />
          </div>
          <div className="hidden dark:block w-full">
            <ImageLoader
              src="/logo.png"
              alt="Logo"
              width={128}
              height={128}
              className="object-contain w-full h-auto"
              draggable={false}
              loading="eager"
            />
          </div>
        </div>

        <div
          className={cn(
            'block transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap',
            isCollapsed
              ? 'max-w-0 opacity-0 -translate-x-4'
              : 'max-w-[200px] opacity-100 translate-x-0'
          )}
        >
          <div className="flex flex-col text-start ml-2 ">
            <span className="text-xl font-semibold">Digital Twin</span>
            <span className="text-sm text-muted-foreground">
              Management System
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SidebarHeader
