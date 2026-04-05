import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateCoursePayload,
  UpdateCoursePayload
} from '@/schema/master/course/course-schema'
import { BaseParams } from '@/types/global'
import {
  CourseSemesterResponse,
  GetAllCourseResponse,
  ListCourseResponse,
  ShowCourseResponse
} from '@/types/response/master/course/course-response'

export interface CourseListParams extends BaseParams {
  study_program_id?: string
  semester?: string
  status?: string
}

export const CourseService = {
  list: async (params: CourseListParams) => {
    return api.get<ListCourseResponse[]>(ApiEndpoint.MASTER.COURSE.BASE, {
      params
    })
  },

  getAllCourses: async (params?: { study_program_id?: string }) => {
    return api.get<GetAllCourseResponse[]>(ApiEndpoint.MASTER.COURSE.GET_ALL, {
      params
    })
  },

  getAllSemesters: async () => {
    return api.get<CourseSemesterResponse[]>(
      ApiEndpoint.MASTER.COURSE.GET_ALL_SEMESTER
    )
  },

  detail: async (id: string) => {
    return api.get<ShowCourseResponse>(
      ApiEndpoint.MASTER.COURSE.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateCoursePayload) => {
    return api.post<null>(ApiEndpoint.MASTER.COURSE.BASE, data)
  },

  update: async (id: string, data: UpdateCoursePayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.COURSE.UPDATE.replace(':id', id),
      data
    )
  },

  delete: async (id: string) => {
    return api.delete<null>(
      ApiEndpoint.MASTER.COURSE.DELETE.replace(':id', id)
    )
  },

  toggleStatus: async (id: string) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.COURSE.TOGGLE_STATUS.replace(':id', id)
    )
  }
}

export const {
  list: listCourse,
  getAllCourses,
  getAllSemesters,
  detail: showCourse,
  create: createCourse,
  update: updateCourse,
  delete: deleteCourse,
  toggleStatus: updateCourseStatus
} = CourseService
