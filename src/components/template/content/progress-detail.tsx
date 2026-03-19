import { cn } from '@/lib/utils'
import { format, isValid } from 'date-fns'

interface ProgressItem {
  id?: string
  description: string
  createdAt: string | Date
}

interface ProgressDetailProps {
  progress?: ProgressItem[]
  className?: string
  title?: string
}

export function ProgressDetail({
  progress = [],
  className,
  title = 'Progress Detail'
}: ProgressDetailProps) {
  return (
    <div className={cn('pt-8 mt-8', className)}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="pl-2">
        {progress.map((p, index) => (
          <div key={p.id || index} className="relative pl-8 pb-6 last:pb-0">
            {index !== progress.length - 1 && (
              <div className="absolute left-[5.5px] top-[12px] h-full w-px bg-gray-200" />
            )}
            <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-gray-400 border-2 border-white" />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 font-medium">
                {p.createdAt && isValid(new Date(p.createdAt))
                  ? format(new Date(p.createdAt), 'dd/MM/yy, HH:mm')
                  : '-'}{' '}
                - <span className="text-primary">{p.description}</span>
              </span>
            </div>
          </div>
        ))}
        {progress.length === 0 && (
          <p className="text-gray-500 text-sm">No progress history.</p>
        )}
      </div>
    </div>
  )
}
