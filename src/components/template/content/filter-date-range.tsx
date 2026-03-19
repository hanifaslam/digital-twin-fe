'use client'

import { DatePicker } from '@/components/template/button/date-picker'
import { Card, CardContent } from '@/components/ui/card'

export interface FilterDateRangeGroup {
  label: string
  startDate: Date | undefined
  endDate: Date | undefined
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  startPlaceholder?: string
  endPlaceholder?: string
}

interface FilterDateRangeProps {
  filterGroups: FilterDateRangeGroup[]
}

export function FilterDateRange({ filterGroups }: FilterDateRangeProps) {
  return (
    <div className="space-y-4">
      {filterGroups.map((group, index) => (
        <div key={index}>
          <label className="text-sm font-medium">{group.label}</label>
          <Card className="p-2 mt-2 shadow-none">
            <CardContent className="p-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Start Date
                  </label>
                  <DatePicker
                    value={group.startDate}
                    onChange={group.onStartDateChange}
                    placeholder={group.startPlaceholder || 'Select Date'}
                    captionLayout="dropdown"
                    iconPosition="end"
                    disabledDays={
                      group.endDate
                        ? (date) => date > group.endDate!
                        : undefined
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    End Date
                  </label>
                  <DatePicker
                    value={group.endDate}
                    onChange={group.onEndDateChange}
                    placeholder={group.endPlaceholder || 'Select Date'}
                    captionLayout="dropdown"
                    iconPosition="end"
                    disabledDays={
                      group.startDate
                        ? (date) => date < group.startDate!
                        : undefined
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
