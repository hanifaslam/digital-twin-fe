export const ApiEndpoint = {
  AUTH: {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    ME: "auth/me",
    CHANGE_PASSWORD: "auth/change-password",
    FORGOT_PASSWORD: "auth/forgot-password",
    RESET_PASSWORD: "auth/reset-password",
    VERIF_TOKEN: "auth/verify-reset-token",
  },
} as const;
