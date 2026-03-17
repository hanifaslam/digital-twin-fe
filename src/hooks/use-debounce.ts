import debounce from 'lodash.debounce'
import { useEffect, useMemo, useState } from 'react'

export default function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  const debouncedSet = useMemo(
    () => debounce((v: T) => setDebouncedValue(v), delay),
    [delay]
  )

  useEffect(() => {
    debouncedSet(value)
  }, [value, debouncedSet])

  useEffect(() => {
    return () => {
      debouncedSet.cancel()
    }
  }, [debouncedSet])

  return debouncedValue
}
