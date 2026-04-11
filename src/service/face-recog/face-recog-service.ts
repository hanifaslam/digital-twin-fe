import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { StatusFaceResponse } from '@/types/response/face-recog/face-recog-response'

export const FaceService = {
  register: async (image: File) => {
    const formData = new FormData()
    formData.append('image', image)
    return api.post<null>(ApiEndpoint.FACE_RECOGNITION.REGISTER, formData)
  },

  verify: async (image: File) => {
    const formData = new FormData()
    formData.append('image', image)
    return api.post<null>(ApiEndpoint.FACE_RECOGNITION.VERIFY, formData)
  },

  checkStatus: async () => {
    return api.get<StatusFaceResponse>(
      ApiEndpoint.FACE_RECOGNITION.CHECK_STATUS
    )
  }
}

export const {
  register: registerFace,
  verify: verifyFace,
  checkStatus: checkFaceStatus
} = FaceService
