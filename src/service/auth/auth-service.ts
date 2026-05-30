import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { ForgotPasswordFormPayload } from '@/schema/auth/change-password-schema'
import { LoginInput } from '@/schema/auth/login-schema'
import { BaseResponse } from '@/types/base-response'
import { LoginResponse, MeResponse } from '@/types/response/auth/auth-response'

export async function login(
  credentials: LoginInput
): Promise<BaseResponse<LoginResponse>> {
  const response = await api.post<LoginResponse>(
    ApiEndpoint.AUTH.LOGIN,
    credentials
  )

  return response
}

export async function logout() {
  return api.post(ApiEndpoint.AUTH.LOGOUT)
}

export async function me() {
  const response = await api.get<MeResponse>(ApiEndpoint.AUTH.ME)

  return response
}

export async function forgotPassword(payload: ForgotPasswordFormPayload) {
  return api.post(ApiEndpoint.AUTH.FORGOT_PASSWORD, { ...payload })
}

export async function refreshToken() {
  return api.post(ApiEndpoint.AUTH.REFRESH)
}

export async function updateProfile(payload: { name?: string; email?: string; phone_number?: string }) {
  return api.patch(ApiEndpoint.AUTH.UPDATE_PROFILE, payload)
}

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return api.post<{ profile_picture: string }>(ApiEndpoint.AUTH.UPLOAD_PROFILE_PHOTO, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
