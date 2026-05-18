import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { defaultStatCards, helperStatCards, type StatCardItem } from './data'

function StatCard({ item }: { item: StatCardItem }) {
  const Icon = item.icon

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {item.title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${item.valueClassName || ''}`}>
          {item.value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardStatsSection({ isHelper }: { isHelper: boolean }) {
  const items = isHelper ? helperStatCards : defaultStatCards

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.title} item={item} />
      ))}
    </div>
  )
}
