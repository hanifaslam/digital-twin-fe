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
    }
  }
} as const
