import { api } from '@/lib/api/axios'

type Method = 'post' | 'put' | 'patch' | 'delete'
export type MutationArg<TBody> = {
  arg: TBody
}
function createSWRMutationFetcher(method: Method) {
  return async <TResponse, TBody = undefined>(
    url: string,
    { arg }: MutationArg<TBody>
  ): Promise<TResponse> => {
    switch (method) {
      case 'post': {
        const res = await api.post<TResponse, TBody>(url, arg)
        return res.data
      }

      case 'put': {
        const res = await api.put<TResponse, TBody>(url, arg)
        return res.data
      }

      case 'patch': {
        const res = await api.patch<TResponse, TBody>(url, arg)
        return res.data
      }

      case 'delete': {
        const res = await api.delete<TResponse>(url)
        return res.data
      }
    }
  }
}

export const swrPost = createSWRMutationFetcher('post')
export const swrPut = createSWRMutationFetcher('put')
export const swrPatch = createSWRMutationFetcher('patch')
export const swrDelete = createSWRMutationFetcher('delete')
