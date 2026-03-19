import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  label: string
  options: FilterOption[]
  selected: string
  onChange: (selected: string) => void
  scrollable?: boolean
}

interface FilterRadioProps {
  filterGroups: FilterGroup[]
  onShowAll?: (type: 'radio', index: number) => void
}

export function FilterRadio({ filterGroups, onShowAll }: FilterRadioProps) {
  return (
    <div className="space-y-4">
      {filterGroups.map((group, index) => {
        const displayOptions =
          group.options.length > 5 ? group.options.slice(0, 5) : group.options
        const hasMore = group.options.length > 5

        return (
          <div key={index}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{group.label}</label>
              {hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShowAll?.('radio', index)}
                >
                  See All
                </Button>
              )}
            </div>
            <Card className="p-2 mt-2 shadow-none">
              <CardContent className="p-2">
                {group.scrollable ? (
                  <ScrollArea className="max-h-34">
                    <RadioGroup
                      value={group.selected}
                      onValueChange={group.onChange}
                      className="space-y-0"
                    >
                      {displayOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <label htmlFor={option.value} className="text-sm">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </ScrollArea>
                ) : (
                  <RadioGroup
                    value={group.selected}
                    onValueChange={group.onChange}
                    className="space-y-0"
                  >
                    {displayOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <label htmlFor={option.value} className="text-sm">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
