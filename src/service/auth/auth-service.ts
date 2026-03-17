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
