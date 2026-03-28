import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { BaseParams } from '@/types/global'
import {
  GetAllStudyPrograms,
  ListStudyProgramResponse,
  ShowStudyProgramResponse
} from '@/types/response/master/study-program/study-program-response'

export type StudyProgramListParams = BaseParams

export const StudyProgramService = {
  list: async (params: StudyProgramListParams) => {
    return api.get<ListStudyProgramResponse[]>(
      ApiEndpoint.MASTER.STUDY_PROGRAM.BASE,
      {
        params
      }
    )
  },

  detail: async (id: string) => {
    return api.get<ShowStudyProgramResponse>(
      ApiEndpoint.MASTER.STUDY_PROGRAM.SHOW.replace(':id', id)
    )
  },

  getAllStudyPrograms: async () => {
    return api.get<GetAllStudyPrograms[]>(
      ApiEndpoint.MASTER.STUDY_PROGRAM.GET_ALL
    )
  }
}

export const {
  list: listStudyProgram,
  detail: showStudyProgram,
  getAllStudyPrograms: getAllStudyPrograms
} = StudyProgramService
