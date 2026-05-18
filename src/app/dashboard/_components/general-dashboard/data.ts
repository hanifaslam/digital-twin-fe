import { Activity, Building, CalendarCheck, Users, Video, type LucideIcon } from 'lucide-react'

export const attendanceData = [
  { day: 'Mon', present: 140, absent: 12 },
  { day: 'Tue', present: 152, absent: 5 },
  { day: 'Wed', present: 138, absent: 15 },
  { day: 'Thu', present: 145, absent: 8 },
  { day: 'Fri', present: 160, absent: 2 }
]

export const chartConfig = {
  present: {
    label: 'Present',
    color: '#2563eb'
  },
  absent: {
    label: 'Absent',
    color: '#ef4444'
  }
}

export const liveClasses = [
  {
    course: 'Pemrograman Web',
    room: 'Room 101',
    lecturer: 'Dr. John Doe',
    status: 'Present',
    statusColor: 'bg-green-500/10 text-green-600'
  },
  {
    course: 'Kecerdasan Buatan',
    room: 'Room 205',
    lecturer: 'Prof. Jane Smith',
    status: 'Present',
    statusColor: 'bg-green-500/10 text-green-600'
  },
  {
    course: 'Jaringan Komputer',
    room: 'Room 302',
    lecturer: 'Dr. Richard Roe',
    status: 'Late',
    statusColor: 'bg-red-500/10 text-red-600'
  },
  {
    course: 'Sistem Operasi',
    room: 'Room 404',
    lecturer: 'Dr. Emily Davis',
    status: 'Waiting',
    statusColor: 'bg-yellow-500/10 text-yellow-600'
  },
  {
    course: 'Basis Data',
    room: 'Room 310',
    lecturer: 'Prof. Michael Brown',
    status: 'Waiting',
    statusColor: 'bg-yellow-500/10 text-yellow-600'
  }
]

export const monitoringDevices = [
  {
    title: 'Camera - Room 101',
    building: 'Gedung A',
    status: 'Online',
    color: 'bg-green-500/10 text-green-500'
  },
  {
    title: 'Camera - Room 102',
    building: 'Gedung A',
    status: 'Offline',
    color: 'bg-red-500/10 text-red-500'
  },
  {
    title: 'Camera - Room 201',
    building: 'Gedung B',
    status: 'Online',
    color: 'bg-green-500/10 text-green-500'
  },
  {
    title: 'Camera - Room 205',
    building: 'Gedung B',
    status: 'Online',
    color: 'bg-green-500/10 text-green-500'
  },
  {
    title: 'Camera - Room 301',
    building: 'Gedung C',
    status: 'Warning',
    color: 'bg-yellow-500/10 text-yellow-500'
  }
]

export const upcomingClasses = [
  {
    class_name: 'TI-3A',
    room_name: 'Room 101',
    course_name: 'Pemrograman Web',
    time_label: '08:00 - 10:30'
  },
  {
    class_name: 'TI-3B',
    room_name: 'Room 205',
    course_name: 'Sistem Cerdas',
    time_label: '10:30 - 13:00'
  },
  {
    class_name: 'SI-2A',
    room_name: 'Room 301',
    course_name: 'Basis Data',
    time_label: '13:30 - 16:00'
  },
  {
    class_name: 'TI-4A',
    room_name: 'Room 102',
    course_name: 'Manajemen Proyek TI',
    time_label: '16:00 - 18:30'
  }
]

export type StatCardItem = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  valueClassName?: string
}

export const helperStatCards: StatCardItem[] = [
  {
    title: 'Buildings Monitored',
    value: '4',
    description: 'Buildings assigned to you',
    icon: Building
  },
  {
    title: 'Total Devices',
    value: '24',
    description: 'Face recognition devices',
    icon: Activity
  },
  {
    title: 'Offline Devices',
    value: '2',
    description: 'Needs attention',
    icon: CalendarCheck,
    valueClassName: 'text-red-500'
  },
  {
    title: 'Classes Active',
    value: '18',
    description: 'Currently running in your buildings',
    icon: Users
  }
]

export const defaultStatCards: StatCardItem[] = [
  {
    title: 'Total Lecturers',
    value: '164',
    description: '+4 since last month',
    icon: Users
  },
  {
    title: 'Total Devices',
    value: '85',
    description: 'Active face recognition units',
    icon: Video
  },
  {
    title: 'Active Rooms',
    value: '32',
    description: 'Currently in use',
    icon: Building
  },
  {
    title: 'System Health',
    value: '99.9%',
    description: 'All sensors operational',
    icon: Activity
  }
]
