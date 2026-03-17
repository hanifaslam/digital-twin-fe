import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  ChangePasswordFormPayload,
  ForgotPasswordResetFormPayload
} from '@/schema/auth/change-password-schema'
import type { BaseResponse } from '@/types/base-response'

export async function changePassword(
  payload: ChangePasswordFormPayload
): Promise<BaseResponse<null>> {
  const response = await api.put<null>(
    ApiEndpoint.AUTH.CHANGE_PASSWORD,
    payload
  )

  return response
}

export async function verifyResetToken(token: string) {
  const response = await api.get<null>(ApiEndpoint.AUTH.VERIF_TOKEN, {
    params: { token }
  })

  return response
}

export async function resetPassword(
  payload: ForgotPasswordResetFormPayload,
  token: string
): Promise<BaseResponse<null>> {
  const response = await api.post<null>(
    ApiEndpoint.AUTH.RESET_PASSWORD,
    payload,
    { params: { token } }
  )

  return response
}
