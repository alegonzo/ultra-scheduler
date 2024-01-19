'use client'
import { format, getHours, setHours } from 'date-fns'
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  rem,
  Stack,
  Table,
  Tooltip,
} from '@mantine/core'
import { useMemo, useTransition } from 'react'
import {
  IconDots,
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
          <Table.Td style={{ position: 'sticky' }}>
            <Group style={{ width: 100 }} fw={'bold'}>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon size={'sm'} variant={'outline'} color={'default'}>
                    <IconDots />
                  </ActionIcon>
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

              {f.name}
            </Group>
          </Table.Td>
          {hours.map((hour) => {
            if (hour >= arrivalHour && hour <= departureHour)
              return (
                <Tooltip label={f.name} key={hour}>
                  <Table.Td bg={_color}>
                    {f.arrival && hour === arrivalHour && (
                      <Stack align={'center'} gap={'xs'} fw={'bold'}>
                        <IconPlaneArrival />
                        {format(f.arrival, 'h:mm')}
                      </Stack>
                    )}
                    {f.departure && hour === departureHour && (
                      <Stack align={'center'} gap={'xs'} fw={'bold'}>
                        <IconPlaneDeparture />
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
      <Table.Th key={hour}>
        <Box style={{ width: 45 }}>
          {format(setHours(new Date(), hour), 'h a')}
        </Box>
      </Table.Th>
    ))
  }, [])

  return (
    <Table.ScrollContainer minWidth={500}>
      <Table
        stickyHeader
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 150, position: 'sticky' }}>
              Flight
            </Table.Th>
            {header}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{renderRows()}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
