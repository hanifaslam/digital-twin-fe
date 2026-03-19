import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  label: string
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  scrollable?: boolean
  showAll?: boolean
  onToggleShowAll?: () => void
  hasMore?: boolean
}

interface FilterCheckboxProps {
  filterGroups: FilterGroup[]
  onShowAll?: (type: 'checkbox', index: number) => void
}

export function FilterCheckbox({
  filterGroups,
  onShowAll
}: FilterCheckboxProps) {
  const handleChange = (
    group: FilterGroup,
    value: string,
    checked: boolean
  ) => {
    if (checked) {
      group.onChange([...group.selected, value])
    } else {
      group.onChange(group.selected.filter((s) => s !== value))
    }
  }

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
                  onClick={() => onShowAll?.('checkbox', index)}
                >
                  See All
                </Button>
              )}
            </div>
            <Card className="p-2 mt-2 shadow-none">
              <CardContent className="p-2">
                {group.scrollable ? (
                  <ScrollArea viewportClassName="max-h-34">
                    <div className="space-y-2">
                      {displayOptions.map((option) => {
                        const optionId = `filter-${index}-${option.value}`
                        return (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={optionId}
                              checked={group.selected.includes(option.value)}
                              onCheckedChange={(checked) =>
                                handleChange(
                                  group,
                                  option.value,
                                  checked as boolean
                                )
                              }
                            />
                            <label htmlFor={optionId} className="text-sm">
                              {option.label}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="space-y-2">
                    {displayOptions.map((option) => {
                      const optionId = `filter-${index}-${option.value}`
                      return (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={optionId}
                            checked={group.selected.includes(option.value)}
                            onCheckedChange={(checked) =>
                              handleChange(
                                group,
                                option.value,
                                checked as boolean
                              )
                            }
                          />
                          <label htmlFor={optionId} className="text-sm">
                            {option.label}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
