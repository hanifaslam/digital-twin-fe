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
      UPDATE: 'lecturers/:id',
      GET_ALL: 'lecturers/all',
      OVERRIDE_STATUS: 'lecturers/status/override'
    },
    STUDY_PROGRAM: {
      BASE: 'study-programs',
      SHOW: 'study-programs/:id',
      UPDATE: 'study-programs/:id',
      GET_ALL: 'study-programs/all',
      TOGGLE_STATUS: 'study-programs/:id/status',
      DELETE: 'study-programs/:id'
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
      CONTROL: 'devices/:id/control',
      GET_TYPES: 'devices/types',
      DELETE: 'devices/:id'
    },
    HELPER: {
      BASE: 'helpers',
      SHOW: 'helpers/:id',
      UPDATE: 'helpers/:id',
      GET_ALL: 'helpers/all'
    },
    COURSE: {
      BASE: 'courses',
      SHOW: 'courses/:id',
      UPDATE: 'courses/:id',
      GET_ALL: 'courses/all',
      GET_ALL_SEMESTER: 'courses/semesters',
      TOGGLE_STATUS: 'courses/:id/status',
      DELETE: 'courses/:id'
    },
    TIME_SLOT: {
      BASE: 'time-slots',
      SHOW: 'time-slots/:id',
      UPDATE: 'time-slots/:id',
      GET_ALL: 'time-slots/all',
      DELETE: 'time-slots/:id'
    },
    CLASS: {
      BASE: 'classes',
      SHOW: 'classes/:id',
      UPDATE: 'classes/:id',
      GET_ALL: 'classes/all',
      TOGGLE_STATUS: 'classes/:id/status',
      DELETE: 'classes/:id'
    },
    SCHEDULE: {
      BASE: 'schedules',
      LIST: 'schedules/grouped',
      SHOW: 'schedules/:id',
      UPDATE: 'schedules/:id',
      TOGGLE_STATUS: 'schedules/:id/status',
      DELETE: 'schedules/:id',
      GET_ALL_DAYS: 'schedules/days'
    }
  },
  FACE_RECOGNITION: {
    REGISTER: 'face-recognition/register',
    VERIFY: 'face-recognition/verify',
    CHECK_STATUS: 'face-recognition/status'
  }
} as const
