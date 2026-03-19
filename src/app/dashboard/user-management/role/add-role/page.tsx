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
import {
  CreateRolePayload,
  roleSchema
} from '@/schema/user-management/role-schema'
import { createRole, indexAccess } from '@/service/user-management/role-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import RoleSkeletonLoading from '../skeleton-loading'
import TreeBuilder from '../tree-builder'

export default function AddRolePage() {
  const router = useRouter()

  const {
    data: accessResp,
    isLoading: isAccessLoading,
    run: runAccess
  } = useFetcher(indexAccess, {
    immediate: false
  })

  const roleForm = useForm<CreateRolePayload>({
    resolver: zodResolver(roleSchema()) as Resolver<CreateRolePayload>,
    mode: 'onBlur',
    defaultValues: {
      name: '',
      access: [],
      code: '',
      status: true
    }
  })

  useEffect(() => {
    runAccess()
  }, [runAccess])

  useEffect(() => {
    if (!accessResp) return

    try {
      const dashboardItems = accessResp
        .filter((a) => a.code.toLowerCase() === 'dashboard')
        .map((a) => ({ id: String(a.id), is_checked: true }))

      if (dashboardItems.length) {
        roleForm.setValue('access', dashboardItems, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false
        })
      }
    } catch {
      console.error('Failed to set default access values')
    }
  }, [accessResp, roleForm])

  const { onSubmit, isSubmitting } = useSubmit<CreateRolePayload, null>({
    mutation: createRole,
    form: roleForm,
    uniqueErrors: [
      {
        field: 'name',
        triggers: ['name must be unique'],
        message: 'Name is already used'
      },
      {
        field: 'code',
        triggers: ['code already exists'],
        message: 'Code is already used'
      }
    ],
    autoReset: true,
    resetDelay: 100,
    notifySuccess: (msg) => toast.success(msg),
    notifyError: (msg) => {
      toast.error(msg)
    },
    successMessage: 'Successfully Added Role',
    errorMessage: 'Failed To Add Role',
    onSuccess: () => {
      router.push('/dashboard/user-management/role')
    }
  })

  if (!accessResp && isAccessLoading) {
    return (
      <ContentLayout title="Add Role">
        <RoleSkeletonLoading />
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title="Add Role">
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
              {isAccessLoading ? (
                <div className="text-muted-foreground text-sm">
                  Loading access...
                </div>
              ) : (accessResp || []).length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No access available
                </div>
              ) : (
                <FormField
                  control={roleForm.control}
                  name="access"
                  render={({ field }) => (
                    <TreeBuilder accessData={accessResp || []} field={field} />
                  )}
                />
              )}
            </CardContent>
          </Card>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/dashboard/user-management/role')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !roleForm.formState.isValid}
            >
              {isSubmitting ? 'Adding...' : 'Add Role'}
            </Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
