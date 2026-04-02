export const ApiEndpoint = {
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    ME: 'auth/me',
    CHANGE_PASSWORD: 'auth/change-password',
    FORGOT_PASSWORD: 'auth/forgot-password',
    RESET_PASSWORD: 'auth/reset-password/:token',
    VERIF_TOKEN: 'auth/verify-reset-token',
    REFRESH: 'auth/refresh'
  },
  USER_MANAGEMENT: {
    ROLE: {
      BASE: 'roles',
      SHOW: 'roles/:id',
      UPDATE: 'roles/:id',
      TOGGLE_STATUS: 'roles/:id/status',
      PERMISSION: 'permissions',
      GET_ALL: 'roles/all'
    },
    USER: {
      BASE: 'users',
      SHOW: 'users/:id',
      UPDATE: 'users/:id',
      TOGGLE_STATUS: 'users/:id/status',
      RESET_PASSWORD: 'users/:id/reset-password',
      GET_ALL: 'users/all'
    }
  },
  MASTER: {
    LECTURER: {
      BASE: 'lecturers',
      SHOW: 'lecturers/:id',
      UPDATE: 'lecturers/:id'
    },
    STUDY_PROGRAM: {
      BASE: 'study-programs',
      SHOW: 'study-programs/:id',
      UPDATE: 'study-programs/:id',
      GET_ALL: 'study-programs/all'
    },
    ROOM: {
      BASE: 'rooms',
      SHOW: 'rooms/:id',
      UPDATE: 'rooms/:id',
      GET_ALL: 'rooms/all',
      TOGGLE_STATUS: 'rooms/:id/status',
      DELETE: 'rooms/:id'
    },
    FLOOR: {
      BASE: 'floors',
      SHOW: 'floors/:id',
      UPDATE: 'floors/:id',
      GET_ALL: 'floors/all'
    },
    BUILDING: {
      BASE: 'buildings',
      SHOW: 'buildings/:id',
      UPDATE: 'buildings/:id',
      GET_ALL: 'buildings/all'
    },
    DEVICE: {
      BASE: 'devices',
      SHOW: 'devices/:id',
      UPDATE: 'devices/:id',
      TOGGLE_STATUS: 'devices/:id/status',
      GET_TYPES: 'devices/types',
      DELETE: 'devices/:id'
    },
    HELPER: {
      BASE: 'helpers',
      SHOW: 'helpers/:id',
      UPDATE: 'helpers/:id',
      GET_ALL: 'helpers/all'
    }
  }
} as const
