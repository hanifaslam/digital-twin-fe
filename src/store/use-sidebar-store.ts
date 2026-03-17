import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  isHidden: boolean
  openMenus: string[]
  hasHydrated: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
  setIsMobileOpen: (isMobileOpen: boolean) => void
  setIsHidden: (isHidden: boolean) => void
  toggleCollapsed: () => void
  toggleMobileOpen: () => void
  toggleMenu: (menuId: string) => void
  setMenuOpen: (menuId: string, isOpen: boolean) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      isHidden: false,
      openMenus: [],
      hasHydrated: false,
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      setIsMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
      setIsHidden: (isHidden) => set({ isHidden }),
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      toggleMobileOpen: () =>
        set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      toggleMenu: (menuId) =>
        set((state) => ({
          openMenus: state.openMenus.includes(menuId)
            ? state.openMenus.filter((id) => id !== menuId)
            : [...state.openMenus, menuId]
        })),
      setMenuOpen: (menuId, isOpen) =>
        set((state) => ({
          openMenus: isOpen
            ? state.openMenus.includes(menuId)
              ? state.openMenus
              : [...state.openMenus, menuId]
            : state.openMenus.filter((id) => id !== menuId)
        })),
      setHasHydrated: (state) => set({ hasHydrated: state })
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        openMenus: state.openMenus
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
