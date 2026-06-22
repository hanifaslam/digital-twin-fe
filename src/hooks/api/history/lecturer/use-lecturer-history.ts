import {
  LecturerHistoryListParams,
  LecturerHistoryService
} from '@/service/history/lecturer/lecturer-history-service'
import useSWR from 'swr'

export function useLecturerHistory(params: Partial<LecturerHistoryListParams>) {
  return useSWR(['lecturer-history-list', params], () =>
    LecturerHistoryService.list(params as LecturerHistoryListParams)
  )
}

export function useLecturerActivityLog(id: string | null, date?: string) {
  return useSWR(id ? ['lecturer-activity-log', id, date] : null, () =>
    LecturerHistoryService.activityLog(id as string, { date })
  )
}
