'use client'

import ContentLayout from '@/components/layout/content-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import useFetcher from '@/hooks/use-fetcher'
import { updateRoleSchema } from '@/schema/user-management/role-schema'
import { showRole } from '@/service/user-management/role-service'
import { ShowAccessResponse } from '@/types/response/user-management/role-response'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { z } from 'zod'
import RoleSkeletonLoading from '../../skeleton-loading'
import TreeBuilder, { RoleCheckState } from '../../tree-builder'

const detailRoleFormSchema = updateRoleSchema()

type DetailRoleFormData = z.infer<ReturnType<typeof updateRoleSchema>>

export default function DetailRolePage() {
  const params = useParams()
  const rawId = params.id
  const roleId = Array.isArray(rawId) ? rawId[0] : (rawId as string)
  const router = useRouter()

  const {
    data: roleResp,
    isLoading: isRoleLoading,
    run: runFetchRole
  } = useFetcher(() => showRole(roleId), { immediate: false })

  const roleForm = useForm<DetailRoleFormData>({
    resolver: zodResolver(detailRoleFormSchema) as Resolver<DetailRoleFormData>,
    defaultValues: {
      name: '',
      access: [],
      code: '',
      status: undefined
    }
  })

  useEffect(() => {
    runFetchRole()
  }, [runFetchRole])

  useEffect(() => {
    if (!roleResp) return

    const hasCheckedDescendant = (node: ShowAccessResponse): boolean => {
      if (!node.children) return false
      for (const child of node.children) {
        if (child.is_checked || hasCheckedDescendant(child)) return true
      }
      return false
    }

    const collectAllAccess = (
      items: ShowAccessResponse[]
    ): Array<RoleCheckState> => {
      const result: Array<RoleCheckState> = []
      const collect = (nodes: ShowAccessResponse[]) => {
        for (const node of nodes) {
          let isChecked = !!node.is_checked
          if (
            node.children &&
            node.children.length > 0 &&
            isChecked &&
            !hasCheckedDescendant(node)
          ) {
            isChecked = false
          }
          result.push({
            id: String(node.id),
            is_checked: isChecked
          })
          if (node.children && node.children.length > 0) {
            collect(node.children)
          }
        }
      }
      collect(items)
      return result
    }

    roleForm.reset({
      name: roleResp.name,
      code: roleResp.code,
      status: roleResp.status,
      access: collectAllAccess(roleResp.access)
    })
  }, [roleResp, roleForm])

  if (isRoleLoading) {
    return (
      <ContentLayout title="Detail Role">
        <RoleSkeletonLoading />
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title="Detail Role">
      <Form {...roleForm}>
        <div className="space-y-6">
          <Card className="shadow-none">
            <CardContent className="flex flex-col space-y-6 w-full pt-6">
              <div className="flex space-x-4 w-full">
                <FormField
                  control={roleForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Enter name"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Role Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Enter code"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-24 w-full">
                <FormField
                  control={roleForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Switch
                            disabled
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="text-sm">
                            {field.value ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Access Management List</CardTitle>
            </CardHeader>
            <CardContent>
              {!roleResp?.access || roleResp.access.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No access available
                </div>
              ) : (
                <FormField
                  control={roleForm.control}
                  name="access"
                  render={({ field }) => (
                    <TreeBuilder
                      accessData={roleResp.access}
                      field={field}
                      disabled
                    />
                  )}
                />
              )}
            </CardContent>
          </Card>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/user-management/role/edit-role/${roleId}`
                )
              }
            >
              Edit
            </Button>
          </div>
        </div>
      </Form>
    </ContentLayout>
  )
}
