import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { format, isValid } from 'date-fns'

export interface RevisionItem {
  id?: string
  date: string | Date
  user?: string
  sales?: string
  notes?: string
  description?: string
}

interface RevisionHistoryCardProps {
  revisions?: RevisionItem[]
  className?: string
  title?: string
}

export function RevisionHistoryCard({
  revisions = [],
  className,
  title = 'Revision History'
}: RevisionHistoryCardProps) {
  if (!revisions || revisions.length === 0) return null

  return (
    <Card className={cn('border-2 border-red-200', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {revisions.map((item, index) => {
          const date = item.date ? new Date(item.date) : null
          const user = item.user || item.sales || 'Unknown User'
          const notes = item.notes || item.description || '-'

          return (
            <div key={item.id || index} className="relative pl-4 space-y-1">
              <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-red-700" />
              <div className="text-xs text-muted-foreground">
                {date && isValid(date) ? format(date, 'dd/MM/yy HH:mm') : '-'}
                {' • '}
                <span className="font-bold text-foreground">{user}</span>
              </div>
              <p className="text-sm text-foreground">{notes}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
