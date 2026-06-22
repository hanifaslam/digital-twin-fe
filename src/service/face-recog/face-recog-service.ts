import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { StatusFaceResponse } from '@/types/response/face-recog/face-recog-response'

export const FaceService = {
  register: async (image: File) => {
    const formData = new FormData()
    formData.append('image', image)
    return api.post<null>(ApiEndpoint.FACE_RECOGNITION.REGISTER, formData)
  },

  verify: async (
    image: File,
    location?: { latitude: number; longitude: number }
  ) => {
    const formData = new FormData()
    formData.append('image', image)
    if (location) {
      formData.append('latitude', String(location.latitude))
      formData.append('longitude', String(location.longitude))
    }
    return api.post<null>(ApiEndpoint.FACE_RECOGNITION.VERIFY, formData)
  },

  manualVerify: async (location: { latitude: number; longitude: number }) => {
    return api.post<null>(ApiEndpoint.FACE_RECOGNITION.MANUAL_VERIFY, location)
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
  manualVerify,
  checkStatus: checkFaceStatus
} = FaceService
