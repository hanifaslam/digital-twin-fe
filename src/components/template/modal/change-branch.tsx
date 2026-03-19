import { XCircleIcon } from '@/components/icons/x-circle-icon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import useFetcher from '@/hooks/use-fetcher'
import { cn } from '@/lib/utils'
import {
  getAllUserBranch,
  switchBranch
} from '@/service/user-management/user-service'
import useAuthStore from '@/store/auth-store'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ChangeBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChangeBranchDialog({
  open,
  onOpenChange
}: ChangeBranchDialogProps) {
  const { user } = useAuthStore()
  const [isSwitching, setIsSwitching] = useState(false)

  const { data: branches, isLoading: isLoadingBranches } = useFetcher(
    getAllUserBranch,
    { immediate: !!user?.is_superadmin && open }
  )

  const onSelectBranch = async (branchId: string) => {
    if (String(branchId) === String(user?.branch?.id)) return

    try {
      setIsSwitching(true)
      const res = await switchBranch(branchId)

      if (res.success) {
        toast.success('Branch switched successfully')
        window.location.reload()
      } else {
        toast.error(res.message || 'Failed to switch branch')
        setIsSwitching(false)
      }
    } catch (error) {
      toast.error('An error occurred while switching branch')
      setIsSwitching(false)
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md [&>button:last-child]:hidden px-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Select Branch
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute top-4 right-3 hover:bg-transparent"
            >
              <XCircleIcon className="text-primary" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <ScrollArea className="flex flex-col gap-3 py-4 px-4 max-h-[35vh]">
          <div className="flex flex-col gap-3">
            {isLoadingBranches
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))
              : branches?.map((branch) => {
                  const isSelected =
                    String(branch.id) === String(user?.branch?.id)
                  return (
                    <div
                      key={branch.id}
                      onClick={() => !isSwitching && onSelectBranch(branch.id)}
                      className={cn(
                        'relative flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all',
                        isSelected
                          ? 'bg-[#006D5B] text-white border-[#006D5B]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#006D5B]/50',
                        isSwitching && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span className="font-medium">{branch.name}</span>
                      <div
                        className={cn(
                          'flex items-center justify-center w-6 h-6 rounded-full border',
                          isSelected
                            ? 'bg-white border-white'
                            : 'border-gray-300'
                        )}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#006D5B]" />
                        )}
                      </div>
                    </div>
                  )
                })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
