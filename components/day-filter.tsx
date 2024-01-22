'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { DateInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { format } from 'date-fns'

const _key = 'date'

export default function DayFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const defaultValue = searchParams.get(_key)
    ? dayjs(searchParams.get(_key)).toDate()
    : dayjs().toDate()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set(_key, term)
    } else {
      params.delete(_key)
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <DateInput
      value={defaultValue}
      onChange={(date) => {
        if (date) handleSearch(format(date, 'yyyy-MM-dd'))
      }}
      placeholder="Today"
    />
  )
}
