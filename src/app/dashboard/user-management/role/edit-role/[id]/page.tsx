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
import { useSubmit } from '@/hooks/use-submit'
import { updateRoleSchema } from '@/schema/user-management/role-schema'
import { showRole, updateRole } from '@/service/user-management/role-service'
import { ShowAccessResponse } from '@/types/response/user-management/role-response'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import RoleSkeletonLoading from '../../skeleton-loading'
import TreeBuilder, { RoleCheckState } from '../../tree-builder'

const editRoleFormSchema = updateRoleSchema()

type EditRoleFormData = z.infer<ReturnType<typeof updateRoleSchema>>

export default function EditRolePage() {
  const params = useParams()
  const rawId = params.id
  const roleId = Array.isArray(rawId) ? rawId[0] : (rawId as string)
  const router = useRouter()

  const {
    data: roleResp,
    isLoading: isRoleLoading,
    run: runFetchRole
  } = useFetcher(() => showRole(roleId), { immediate: false })

  const roleForm = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleFormSchema) as Resolver<EditRoleFormData>,
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

  const { onSubmit, isSubmitting } = useSubmit<EditRoleFormData, unknown>({
    mutation: (payload) => {
      return updateRole(roleId, payload)
    },
    form: roleForm,
    uniqueErrors: [
      {
        field: 'name',
        triggers: ['name must be unique'],
        message: 'Name is already used'
      }
    ],
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => {
      toast.error(msg)
    },
    successMessage: 'Successfully Updated Role',
    errorMessage: 'Failed To Update Role',
    onSuccess: () => {
      router.back()
    }
  })

  if (isRoleLoading) {
    return (
      <ContentLayout title="Edit Role">
        <RoleSkeletonLoading />
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title="Edit Role">
      <Form {...roleForm}>
        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="shadow-none">
            <CardContent className="flex flex-col space-y-6 w-full pt-6">
              <div className="flex space-x-4 w-full">
                <FormField
                  control={roleForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Role Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
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
                      <FormLabel>
                        Role Code<span className="text-red-500">*</span>
                      </FormLabel>
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
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span>{field.value ? 'Active' : 'Inactive'}</span>
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
              <CardTitle>
                Access Management List <span className="text-red-500">*</span>
              </CardTitle>
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
                    <TreeBuilder accessData={roleResp.access} field={field} />
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
              type="submit"
              disabled={
                isSubmitting ||
                !roleForm.formState.isValid ||
                !roleForm.formState.isDirty
              }
            >
              {isSubmitting ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
