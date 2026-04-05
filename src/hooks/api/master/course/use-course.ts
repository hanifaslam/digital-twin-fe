import {
  CourseListParams,
  CourseService
} from '@/service/master/course/course-service'
import { useQuery } from '@tanstack/react-query'

export function useCourse(params: Partial<CourseListParams>) {
  return useQuery({
    queryKey: ['course-list', params],
    queryFn: () => CourseService.list(params as CourseListParams)
  })
}
