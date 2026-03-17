import { Access } from '@/schema/user-management/role-schema'
import { ShowAccessResponse } from '@/types/response/user-management/role-response'

export const flattenAccess = (
  access: ShowAccessResponse[]
): { id: string; is_checked: boolean }[] => {
  const result: { id: string; is_checked: boolean }[] = []
  const traverse = (acc: ShowAccessResponse[]) => {
    for (const a of acc) {
      result.push({ id: String(a.id), is_checked: a.is_checked ?? true })
      if (a.children) traverse(a.children)
    }
  }
  traverse(access)
  return result
}

export const buildAccess = (
  nodes: ShowAccessResponse[],
  selected: Set<string>
): Access[] => {
  return nodes.map((node) => ({
    id: node.id,
    is_checked: selected.has(node.id),
    children: node.children ? buildAccess(node.children, selected) : []
  }))
}
