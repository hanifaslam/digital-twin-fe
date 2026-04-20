import { FolderIcon } from '@/components/icons/folder-icon'
import { HomeIcon } from '@/components/icons/home-icon'
import { RoomIcon } from '@/components/icons/room-icon'
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
      id: 'device-control',
      label: 'Device Control',
      icon: <HomeIcon className="h-6 w-6" />,
      href: '/dashboard/device-control',
      middleware: ['device_control']
    },
    {
      id: 'management',
      label: 'Management',
      icon: <RoomIcon className="h-6 w-6" />,
      middleware: ['management'],
      children: [
        {
          id: 'Schedule',
          label: 'Schedule',
          href: '/dashboard/management/schedule',
          middleware: ['schedule']
        },
        {
          id: 'Class',
          label: 'Class',
          href: '/dashboard/management/class',
          middleware: ['class']
        },
        {
          id: 'Lecturer',
          label: 'Lecturer',
          href: '/dashboard/management/lecturer',
          middleware: ['lecturer']
        },
        {
          id: 'Device',
          label: 'Device',
          href: '/dashboard/management/device',
          middleware: ['device']
        },
        {
          id: 'Helper',
          label: 'Helper',
          href: '/dashboard/management/helper',
          middleware: ['helper']
        }
      ]
    },
    {
      id: 'master-data',
      label: 'Master Data',
      icon: <FolderIcon className="h-6 w-6" />,
      middleware: ['master'],
      children: [
        {
          id: 'Room',
          label: 'Room',
          href: '/dashboard/master-data/room',
          middleware: ['room']
        },
        {
          id: 'Study Program',
          label: 'Study Program',
          href: '/dashboard/master-data/study-program',
          middleware: ['study_program']
        },
        {
          id: 'Course',
          label: 'Course',
          href: '/dashboard/master-data/course',
          middleware: ['course']
        },
        {
          id: 'Time Slot',
          label: 'Time Slot',
          href: '/dashboard/master-data/time-slot',
          middleware: ['time_slot']
        },
        {
          id: 'building',
          label: 'Building',
          href: '/dashboard/master-data/building',
          middleware: ['building']
        },
          {
            id: 'floor',
            label: 'Floor',
            href: '/dashboard/master-data/floor',
            middleware: ['floor']
          },
          
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
