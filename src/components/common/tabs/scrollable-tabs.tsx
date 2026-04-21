import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ScrollableTabsProps {
  value: string
  onValueChange: (value: string) => void
  items: { id: string; label: React.ReactNode }[]
  className?: string
  children?: React.ReactNode
}

export function ScrollableTabs({
  value,
  onValueChange,
  items,
  className,
  children
}: ScrollableTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <ScrollArea className="w-full max-w-full pb-2">
        <TabsList className="bg-card border border-border rounded-lg h-auto py-6 gap-0 w-max justify-start">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center shrink-0">
              <TabsTrigger
                value={item.id}
                className="bg-background text-foreground hover:bg-accent dark:hover:text-accent-foreground hover:text-accent-foreground data-[state=active]:!bg-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:text-white px-4 py-2 rounded-md font-medium transition-all duration-200 relative data-[state=active]:!border-transparent"
              >
                {item.label}
              </TabsTrigger>
              {index < items.length - 1 && (
                <div className="w-px h-6 bg-border mx-2"></div>
              )}
            </div>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {children}
    </Tabs>
  )
}
