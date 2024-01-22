'use client'
import { format, getHours, setHours } from 'date-fns'
import { Box, Group, Menu, rem, Stack, Table, Tooltip } from '@mantine/core'
import { useMemo, useTransition } from 'react'
import {
  IconEdit,
  IconPlaneArrival,
  IconPlaneDeparture,
  IconTrash,
} from '@tabler/icons-react'
import { Flight } from '@prisma/client'
import Link from 'next/link'
import { deleteFlight } from '@/app/_actions'

const hours = Array.from({ length: 24 }, (_, i) => i)

type ScheduleFlight = Flight & { color: string }
type Props = {
  flights: ScheduleFlight[]
}

export default function DaySchedule({ flights }: Props) {
  const [isPending, startTransition] = useTransition()

  const renderRows = () => {
    return flights.map((f) => {
      const _color = f.color
      const arrivalHour = f.arrival ? getHours(f?.arrival) : 0
      const departureHour = f.departure ? getHours(f?.departure) : 23

      return (
        <Table.Tr key={f.id}>
          <Table.Td>
            <Group fw={'bold'}>
              <Menu shadow="md">
                <Menu.Target>
                  <Box style={{ cursor: 'pointer' }}> {f.name}</Box>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconEdit style={{ width: rem(14), height: rem(14) }} />
                    }
                    component={Link}
                    variant="light"
                    href={`/flights/${f.id}/edit`}
                  >
                    Update
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    onClick={() => {
                      startTransition(async () => {
                        await deleteFlight(f.id)
                      })
                    }}
                    disabled={isPending}
                    leftSection={
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Table.Td>
          {hours.map((hour) => {
            if (hour >= arrivalHour && hour <= departureHour)
              return (
                <Tooltip label={f.name} key={hour}>
                  <Table.Td bg={_color} p={4}>
                    {f.arrival && hour === arrivalHour && (
                      <Stack align={'center'} gap={0}>
                        <IconPlaneArrival size={18} />
                        {format(f.arrival, 'H:mm')}
                      </Stack>
                    )}
                    {f.departure && hour === departureHour && (
                      <Stack align={'center'} gap={0}>
                        <IconPlaneDeparture size={18} />
                        {format(f.departure, 'h:mm')}
                      </Stack>
                    )}
                  </Table.Td>
                </Tooltip>
              )
            return (
              <Tooltip label={f.name} key={hour}>
                <Table.Td>
                  <Box></Box>
                </Table.Td>
              </Tooltip>
            )
          })}
        </Table.Tr>
      )
    })
  }

  const header = useMemo(() => {
    return hours.map((hour) => (
      <Table.Th key={hour} fz={'xs'} fw={'light'} style={{ padding: 4 }}>
        <Box>{format(setHours(new Date(), hour), 'H ')}</Box>
      </Table.Th>
    ))
  }, [])

  return (
    <Table
      stickyHeader
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Flight</Table.Th>
          {header}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{renderRows()}</Table.Tbody>
    </Table>
  )
}
