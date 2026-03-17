import { NotificationService } from '@/service/notification/notification-service'
import {
  ListNotificationResponse,
  SSEResponse
} from '@/types/response/notification/notification-response'
import { create } from 'zustand'

interface NotificationState {
  notifications: ListNotificationResponse[]
  unreadCount: number
  isLoading: boolean
  error: string | null

  fetchNotifications: () => Promise<void>
  fetchUnreadCount: () => Promise<void>
  refresh: () => Promise<void>
  markAsRead: (type: string, referenceId: string) => void
  pushNotification: (sseData: SSEResponse) => void
  setNotifications: (notifications: ListNotificationResponse[]) => void
  setUnreadCount: (count: number) => void
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await NotificationService.listNotification({
        page: 1,
        per_page: 10,
        q: ''
      })
      set({
        notifications: (response.data as ListNotificationResponse[]) || [],
        isLoading: false
      })
    } catch (error) {
      set({ error: 'Failed to fetch notifications', isLoading: false })
      console.error('[NotificationStore] Failed to fetch notifications:', error)
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await NotificationService.unreadBadge()
      set({ unreadCount: response.data?.unread_count || 0 })
    } catch (error) {
      console.error('[NotificationStore] Failed to fetch unread count:', error)
    }
  },

  refresh: async () => {
    const { fetchNotifications, fetchUnreadCount } = get()
    await Promise.all([fetchNotifications(), fetchUnreadCount()])
  },

  markAsRead: (type: string, referenceId: string) => {
    const { notifications, unreadCount } = get()
    const notification = notifications.find(
      (n) => n.type === type && n.reference_id === referenceId
    )

    if (notification && !notification.is_read) {
      set({
        notifications: notifications.map((n) =>
          n.type === type && n.reference_id === referenceId
            ? { ...n, is_read: true }
            : n
        ),
        unreadCount: Math.max(0, unreadCount - 1)
      })
    }
  },

  pushNotification: (sseData: SSEResponse) => {
    const { notifications, unreadCount } = get()

    const newNotification: ListNotificationResponse = {
      id: `sse-${Date.now()}`,
      notification_id: sseData.reference_id,
      user_id: '',
      hotel_id: sseData.hotel_id || '',
      reference_id: sseData.reference_id,
      type: sseData.type,
      title: sseData.title,
      description: sseData.description,
      is_read: false,
      icon_url: '',
      created_at: sseData.timestamp
    }

    set({
      notifications: [newNotification, ...notifications],
      unreadCount: unreadCount + 1
    })
  },

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count })
}))

export default useNotificationStore
