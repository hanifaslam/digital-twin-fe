'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { ShowAccessResponse } from '@/types/response/user-management/role-response'
import React from 'react'

export interface RoleCheckState {
  id: string
  is_checked: boolean
}

type FieldLike = {
  value?: Array<RoleCheckState>
  onChange: (v: Array<RoleCheckState>) => void
}

type Props = {
  accessData: ShowAccessResponse[]
  field: FieldLike
  readOnlyCodes?: string[]
  disabled?: boolean
}

export default function TreeBuilder({
  accessData,
  field,
  readOnlyCodes = ['DASHBOARD'],
  disabled = false
}: Props) {
  const uniqueAccessData = accessData.filter(
    (item, index, self) => self.findIndex((i) => i.id === item.id) === index
  )

  type TreeNode = ShowAccessResponse

  function collectAll(
    nodes: ShowAccessResponse[],
    acc: ShowAccessResponse[] = []
  ): ShowAccessResponse[] {
    for (const n of nodes) {
      acc.push(n)
      if (n.children) collectAll(n.children, acc)
    }
    return acc
  }

  function collectDescendants(
    node: TreeNode | undefined,
    acc: string[] = []
  ): string[] {
    if (!node || !node.children) return acc
    for (const c of node.children) {
      acc.push(c.code)
      collectDescendants(c, acc)
    }
    return acc
  }

  const tree = uniqueAccessData

  const allAccess = collectAll(uniqueAccessData)

  const parentMap = new Map<string, string | undefined>()
  function walkAndMap(nodes: TreeNode[], parent?: TreeNode) {
    for (const n of nodes) {
      parentMap.set(n.code, parent?.code)
      if (n.children && n.children.length) walkAndMap(n.children, n)
    }
  }
  walkAndMap(tree)

  const descendantsMap = new Map<string, string[]>()
  function buildDescendants(node: TreeNode): string[] {
    const desc: string[] = []
    if (node.children) {
      for (const c of node.children) {
        desc.push(c.code)
        desc.push(...buildDescendants(c))
      }
    }
    descendantsMap.set(node.code, desc)
    return desc
  }
  tree.forEach((root) => buildDescendants(root))

  const selected = new Set<string>(
    (field.value || []).filter((item) => item.is_checked).map((item) => item.id)
  )

  const codeToId = new Map<string, string>()
  allAccess.forEach((a) => codeToId.set(a.code, String(a.id)))

  function subtreeSelected(node: TreeNode | undefined): boolean {
    if (!node) return false
    if (node.code.toLowerCase() === 'dashboard') return true
    if (selected.has(String(node.id))) return true
    if (!node.children) return false
    return node.children.some((c) => subtreeSelected(c))
  }

  function getAncestors(code: string) {
    const out: string[] = []
    let cur = parentMap.get(code)
    while (cur) {
      out.push(cur)
      cur = parentMap.get(cur)
    }
    return out
  }

  const readOnlySet = new Set(readOnlyCodes)

  function handleToggle(node: TreeNode, checked: boolean) {
    const next = new Set(selected)

    const descendants = collectDescendants(node)

    if (checked) {
      if (codeToId.has(node.code)) next.add(codeToId.get(node.code)!)
      for (const d of descendants) {
        const id = codeToId.get(d)
        if (id) next.add(id)
      }

      const ancestors = getAncestors(node.code)
      for (const a of ancestors) {
        const id = codeToId.get(a)
        if (id) next.add(id)
      }
    } else {
      const nodeId = codeToId.get(node.code)
      if (nodeId) next.delete(nodeId)

      for (const d of descendants) {
        const id = codeToId.get(d)
        if (id) next.delete(id)
      }

      const ancestors = getAncestors(node.code)
      for (const a of ancestors) {
        const ancestorNode = allAccess.find((x) => x.code === a)
        if (!ancestorNode) continue

        function findInTree(nodes: TreeNode[]): TreeNode | undefined {
          for (const n of nodes) {
            if (n.code === a) return n
            if (n.children) {
              const r = findInTree(n.children)
              if (r) return r
            }
          }
          return undefined
        }

        const found = findInTree(tree)
        if (!found) continue

        const desc = collectDescendants(found)

        const stillSelected =
          desc.some((d) => {
            const id = codeToId.get(d)
            return id ? next.has(id) : false
          }) ||
          (codeToId.has(found.code) && next.has(codeToId.get(found.code)!))

        const ancestorId = codeToId.get(a)
        if (!stillSelected && ancestorId) next.delete(ancestorId)
      }
    }

    for (const [code, desc] of descendantsMap) {
      const pid = codeToId.get(code)
      if (!pid) continue
      if (next.has(pid)) {
        const hasChildChecked = desc.some((d) => {
          const cid = codeToId.get(d)
          return cid ? next.has(cid) : false
        })
        if (!hasChildChecked && desc.length > 0) {
          next.delete(pid)
        }
      }
    }

    for (const ro of readOnlySet) {
      const rid = codeToId.get(ro)
      if (rid) next.add(rid)
    }

    field.onChange(
      allAccess.map((a) => ({
        id: a.id,
        is_checked: next.has(a.id)
      }))
    )
  }

  function renderNode(
    node: TreeNode,
    level = 0,
    isLast = false,
    parentLines: boolean[] = []
  ) {
    const isChecked = subtreeSelected(node)

    if (node.code === 'Main') {
      return (
        <div key={node.code}>
          <div
            className="py-1 font-medium"
            style={{ paddingLeft: `${level * 16}px` }}
          >
            {node.name}
          </div>
          {node.children && node.children.length > 0 && (
            <div>
              {node.children.map((c, index) =>
                renderNode(
                  c,
                  level + 1,
                  index === node.children!.length - 1,
                  parentLines
                )
              )}
            </div>
          )}
        </div>
      )
    }

    const treeLines: React.ReactNode[] = []

    for (let i = 0; i < level; i++) {
      if (i < parentLines.length && parentLines[i]) {
        treeLines.push(
          <div
            key={`vertical-${i}`}
            className="absolute border-l border-gray-300"
            style={{
              left: `${i * 16 + 6}px`,
              top: '0px',
              bottom: '0px',
              width: '1px'
            }}
          />
        )
      }
    }

    if (level > 0) {
      treeLines.push(
        <div
          key="horizontal"
          className="absolute border-t border-gray-300"
          style={{
            left: `${(level - 1) * 16 + 6}px`,
            top: '12px',
            width: '10px',
            height: '1px'
          }}
        />
      )

      if (!isLast) {
        treeLines.push(
          <div
            key="vertical-current"
            className="absolute border-l border-gray-300"
            style={{
              left: `${(level - 1) * 16 + 6}px`,
              top: '0px',
              bottom: '0px',
              width: '1px'
            }}
          />
        )
      } else {
        treeLines.push(
          <div
            key="vertical-current"
            className="absolute border-l border-gray-300"
            style={{
              left: `${(level - 1) * 16 + 6}px`,
              top: '0px',
              height: '12px',
              width: '1px'
            }}
          />
        )
      }
    }

    return (
      <div key={node.code}>
        <div
          className="relative flex items-center gap-2 py-1"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {treeLines}
          <Checkbox
            id={`access-${node.id}`}
            className="relative z-10 h-4 w-4"
            checked={isChecked}
            disabled={disabled || node.code.toLowerCase() === 'dashboard'}
            onCheckedChange={(v) => {
              if (disabled || node.code.toLowerCase() === 'dashboard') return
              handleToggle(node, Boolean(v))
            }}
          />
          <label
            htmlFor={`access-${node.id}`}
            className="relative z-10 text-sm"
          >
            {node.name}
          </label>
        </div>
        {node.children && node.children.length > 0 && (
          <div>
            {node.children.map((c, index) => {
              const newParentLines = [...parentLines]
              if (level > 0) {
                newParentLines[level - 1] = !isLast
              }
              return renderNode(
                c,
                level + 1,
                index === node.children!.length - 1,
                newParentLines
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const midpoint = Math.ceil(tree.length / 2)
  const leftRoots = tree.slice(0, midpoint)
  const rightRoots = tree.slice(midpoint)

  return (
    <div className="col-span-2 grid grid-cols-2 gap-4">
      <div>
        {leftRoots.map((t, index) =>
          renderNode(t, 0, index === leftRoots.length - 1, [])
        )}
      </div>
      <div>
        {rightRoots.map((t, index) =>
          renderNode(t, 0, index === rightRoots.length - 1, [])
        )}
      </div>
    </div>
  )
}
