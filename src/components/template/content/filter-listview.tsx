import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface FilterOption {
  label: string
  value: string
}

interface FilterGroupBase {
  label: string
  options: FilterOption[]
}

interface RadioFilterGroup extends FilterGroupBase {
  selected: string
  onChange: (selected: string) => void
}

interface CheckboxFilterGroup extends FilterGroupBase {
  selected: string[]
  onChange: (selected: string[]) => void
}

type FilterGroup = RadioFilterGroup | CheckboxFilterGroup

interface FilterListviewProps {
  type: 'radio' | 'checkbox'
  filterGroup: FilterGroup
  onBack: () => void
}

export function FilterListview({
  type,
  filterGroup,
  onBack
}: FilterListviewProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOptions = filterGroup.options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (value: string, checked?: boolean) => {
    if (type === 'radio') {
      ;(filterGroup as RadioFilterGroup).onChange(value)
    } else {
      const selected = (filterGroup as CheckboxFilterGroup).selected
      if (checked) {
        ;(filterGroup as CheckboxFilterGroup).onChange([...selected, value])
      } else {
        ;(filterGroup as CheckboxFilterGroup).onChange(
          selected.filter((s) => s !== value)
        )
      }
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center space-x-2 sticky top-0 bg-background z-10 pb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {type === 'radio' ? (
          <RadioGroup
            value={(filterGroup as RadioFilterGroup).selected}
            onValueChange={handleChange}
            className="space-y-2"
          >
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 py-4 border-b"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <label htmlFor={option.value} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 py-3 border-b"
              >
                <Checkbox
                  id={option.value}
                  checked={(
                    filterGroup as CheckboxFilterGroup
                  ).selected.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleChange(option.value, checked as boolean)
                  }
                />
                <label htmlFor={option.value} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
