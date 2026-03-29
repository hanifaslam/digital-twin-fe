import {
  StudyProgramListParams,
  StudyProgramService
} from '@/service/master/study-program/study-program-service'
import useSWR from 'swr'

export function useStudyProgram(params: Partial<StudyProgramListParams>) {
  return useSWR(['study-program-list', params], () =>
    StudyProgramService.list(params as StudyProgramListParams)
  )
}
