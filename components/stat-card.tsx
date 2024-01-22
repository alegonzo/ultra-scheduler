import { Card, Text } from '@mantine/core'

type Props = {
  title: string
  value: string
}
export default function StatCard({ title, value }: Props) {
  return (
    <Card withBorder radius="md" padding="xl" bg="var(--mantine-color-body)">
      <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
        {title}
      </Text>
      <Text fz="lg" fw={500}>
        {value}
      </Text>
    </Card>
  )
}
