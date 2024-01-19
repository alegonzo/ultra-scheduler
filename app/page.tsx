import { Stack, Title } from '@mantine/core'
import DaySchedule from '@/components/day-schedule'

export default function Home() {
  return (
    <main>
      <Stack>
        <Title order={3}>Schedule</Title>
        <DaySchedule />
      </Stack>
    </main>
  )
}
