import { HomeIcon } from '@/components/icons/home-icon'
import { UserIcon } from '@/components/icons/user-icon'

export interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  children?: MenuItem[]
  middleware?: string[]
}

export function useMenuItems(): MenuItem[] {
  return [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <HomeIcon className="h-6 w-6" />,
      href: '/dashboard',
      middleware: ['dashboard']
    },
    {
      id: 'master-data',
      label: 'Master Data',
      icon: <UserIcon className="h-6 w-6" />,
      middleware: ['master'],
      children: [
        {
          id: 'Lecturer',
          label: 'Lecturer',
          href: '/dashboard/master-data/lecturer',
          middleware: ['lecturer']
        },
        {
          id: 'Study Program',
          label: 'Study Program',
          href: '/dashboard/master-data/study-program',
          middleware: ['study_program']
        },
        {
          id: 'Room',
          label: 'Room',
          href: '/dashboard/master-data/room',
          middleware: ['room']
        },
        {
          id: 'Device',
          label: 'Device',
          href: '/dashboard/master-data/device',
          middleware: ['device']
        },
        {
          id: 'Helper',
          label: 'Helper',
          href: '/dashboard/master-data/helper',
          middleware: ['helper']
        },
        {
          id: 'Course',
          label: 'Course',
          href: '/dashboard/master-data/course',
          middleware: ['course']
        }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <UserIcon className="h-6 w-6" />,
      middleware: ['user_management'],
      children: [
        {
          id: 'role',
          label: 'Role',
          href: '/dashboard/user-management/role',
          middleware: ['role']
        },
        {
          id: 'user',
          label: 'User',
          href: '/dashboard/user-management/user',
          middleware: ['user']
        }
      ]
    }
  ]
}

export function extractHrefAndMiddleware(
  items: MenuItem[]
): { href?: string; middleware?: string[] }[] {
  const result: { href?: string; middleware?: string[] }[] = []

  const traverse = (menuItems: MenuItem[]) => {
    menuItems.forEach((item) => {
      if (item.href || item.middleware) {
        result.push({
          href: item.href,
          middleware: item.middleware
        })
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    })
  }

  traverse(items)
  return result
}
