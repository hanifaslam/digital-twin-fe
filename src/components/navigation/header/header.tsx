import { logout } from '@/service/auth/auth-service'
import { BreadcrumbItems } from '@/types/layout-types'
import { ChevronDown, KeyIcon, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

import ChangePasswordDialog from '@/components/common/modal/change-pass'
import { BellIcon } from '@/components/icons/bell-icon'
import { PanelLeftIcon } from '@/components/icons/panel-left-icon'
import { useConfirm } from '@/components/providers/confirm-dialog-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import useAuthStore from '@/store/auth-store'
import { useSidebarStore } from '@/store/use-sidebar-store'

interface HeaderLayoutProps {
  breadcrumbs: BreadcrumbItems[]
}

export default function Headers({ breadcrumbs }: HeaderLayoutProps) {
  const { isCollapsed, setIsCollapsed, setIsMobileOpen } = useSidebarStore()
  const [isChangePassOpen, setIsChangePassOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const confirm = useConfirm()
  const router = useRouter()
  const { logout: logoutStore, user } = useAuthStore()

  // const {
  //   notifications: allNotifications,
  //   unreadCount,
  //   isLoading: isNotificationLoading,
  // } = useNotificationStore();

  // const notifications = allNotifications.slice(0, 5);

  // useNotificationSSE();

  async function handleLogout() {
    try {
      const res = await logout()

      if (!res.success) {
        toast.error(res.message || 'Failed to logout')
        router.replace('/login')
        return
      }

      logoutStore()

      toast.success('Logout Success')
      router.replace('/login')
    } catch {
      toast.error('Logout Failed')
      logoutStore()
      router.replace('/login')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-card border-b border-border px-2">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Desktop Sidebar Collapse Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              <PanelLeftIcon className="w-6 h-6 text-muted-foreground hover:text-foreground" />
            </Button>

            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem className="select-none font-medium">
                        {breadcrumb.href ? (
                          <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                        ) : (
                          <BreadcrumbPage className="font-medium">
                            {breadcrumb.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Popover
                open={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2 hover:border-none"
                  >
                    <BellIcon className="w-6 h-6 fill-gray-600 dark:fill-primary-foreground" />
                    {/* {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )} */}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  {/* <div className="flex items-center justify-between p-4 border-b border-border">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <Link
                      href="/dashboard/notification"
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      See All
                    </Link>
                  </div> */}
                  {/* <ScrollArea className="h-[320px]">
                    {isNotificationLoading ? (
                      <NotificationSkeleton count={5} variant="compact" />
                    ) : (
                      <NotificationList
                        notifications={notifications}
                        variant="compact"
                        emptyMessage="No notifications yet"
                        onItemClick={() => setIsNotificationOpen(false)}
                      />
                    )}
                  </ScrollArea> */}
                </PopoverContent>
              </Popover>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild autoFocus={false}>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-auto p-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={''} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || 'US'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">
                        {user?.name ?? 'Unknown User'}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  autoFocus={false}
                >
                  <DropdownMenuItem onClick={() => setIsChangePassOpen(true)}>
                    <KeyIcon className="w-4 h-4 mr-2" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-primary cursor-pointer dark:hover:bg-red-500/20 dark:hover:text-red-500"
                    onClick={async () => {
                      const ok = await confirm({
                        title: 'Logout',
                        description: 'Are you sure you want to logout?',
                        confirmButtonClassName: 'bg-red-600 hover:bg-red-500',
                        confirmText: 'Yes, Logout',
                        destructive: true
                      })

                      if (ok) {
                        await handleLogout()
                      }
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4 hover:text-primary" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <ChangePasswordDialog
        open={isChangePassOpen}
        onOpenChange={(v: boolean) => setIsChangePassOpen(v)}
      />
    </>
  )
}
