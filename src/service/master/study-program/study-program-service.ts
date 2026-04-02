import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { BaseParams } from '@/types/global'
import {
  GetAllStudyPrograms,
  ListStudyProgramResponse,
  ShowStudyProgramResponse
} from '@/types/response/master/study-program/study-program-response'

export interface StudyProgramListParams extends BaseParams {
  building_id?: string
}

export const StudyProgramService = {
  list: async (params: StudyProgramListParams) => {
    return api.get<ListStudyProgramResponse[]>(ApiEndpoint.MASTER.STUDY_PROGRAM.BASE, {
      params
    })
  },

  getAllStudyPrograms: async () => {
    return api.get<GetAllStudyPrograms[]>(ApiEndpoint.MASTER.STUDY_PROGRAM.GET_ALL)
  },

  detail: async (id: string) => {
    return api.get<ShowStudyProgramResponse>(
      ApiEndpoint.MASTER.STUDY_PROGRAM.SHOW.replace(':id', id)
    )
  },

 create: async (data: any) => {
    return api.post<null>(ApiEndpoint.MASTER.STUDY_PROGRAM.BASE, data)
  },

  update: async (id: string, data: any) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.STUDY_PROGRAM.UPDATE.replace(':id', id),
      data
    )
  },

  delete: async (id: string) => {
    return api.delete<null>(ApiEndpoint.MASTER.STUDY_PROGRAM.DELETE.replace(':id', id))
  },

  toggleStatus: async (id: string) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.STUDY_PROGRAM.TOGGLE_STATUS.replace(':id', id)
    )
  }
}

export const {
  list: listStudyProgram,
  getAllStudyPrograms,
  detail: showStudyProgram,
  create: createStudyProgram,
  update: updateStudyProgram,
  delete: deleteStudyProgram,
  toggleStatus: toggleStudyProgramStatus
} = StudyProgramService
