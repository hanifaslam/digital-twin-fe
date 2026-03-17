export interface Metadata {
  per_page?: number
  current_page?: number
  total_page?: number
  total_row?: number
}

export interface BaseResponse<T> {
  success: boolean
  message: string
  metadata: Metadata
  data: T
}
