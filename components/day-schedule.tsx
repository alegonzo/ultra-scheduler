'use client'
import { format, getHours, setHours, setMinutes } from 'date-fns'
import { Box, Stack, Table, Tooltip } from '@mantine/core'
import { useMemo } from 'react'
import { IconPlaneArrival, IconPlaneDeparture } from '@tabler/icons-react'

type Flight = {
  name: string
  arrival: Date
  departure: Date
}

const flights: Flight[] = [
  {
    name: 'Vuelo 1',
    arrival: setMinutes(setHours(new Date(), 0), 30),
    departure: setHours(new Date(), 4),
  },
  {
    name: 'Vuelo 2',
    arrival: setHours(new Date(), 1),
    departure: setMinutes(setHours(new Date(), 5), 40),
  },
  {
    name: 'Vuelo 3',
    arrival: setHours(new Date(), 5),
    departure: setHours(new Date(), 9),
  },
  {
    name: 'Vuelo 5',
    arrival: setHours(new Date(), 1),
    departure: setHours(new Date(), 3),
  },
  {
    name: 'Vuelo 6',
    arrival: setHours(new Date(), 12),
    departure: setHours(new Date(), 15),
  },
  {
    name: 'Vuelo 7',
    arrival: setHours(new Date(), 16),
    departure: setHours(new Date(), 19),
  },
  {
    name: 'Vuelo 8',
    arrival: setHours(new Date(), 20),
    departure: setHours(new Date(), 21),
  },
  {
    name: 'Vuelo 9',
    arrival: setHours(new Date(), 7),
    departure: setHours(new Date(), 10),
  },
  {
    name: 'Vuelo 10',
    arrival: setHours(new Date(), 0),
    departure: setHours(new Date(), 4),
  },
]

const colors = [
  '#F76D6D',
  '#64C1FF',
  '#A2E67E',
  '#E7E17C',
  '#FFCA64',
  '#AC7CE8',
]
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]
const hours = Array.from({ length: 24 }, (_, i) => i)

export default function DaySchedule() {
  const renderRows = () => {
    let lastColor = ''
    return flights.map((f) => {
      let _color = randomColor()
      while (_color === lastColor) {
        _color = randomColor()
        lastColor = _color
      }
      const arrivalHour = getHours(f.arrival)
      const departureHour = getHours(f.departure)

      return (
        <Table.Tr key={f.name}>
          <Table.Td style={{ position: 'sticky' }}>
            <Box style={{ width: 100 }} fw={'bold'}>
              {f.name}
            </Box>
          </Table.Td>
          {hours.map((hour) => {
            if (hour >= arrivalHour && hour <= departureHour)
              return (
                <Tooltip label={f.name}>
                  <Table.Td key={hour} bg={_color}>
                    {hour === arrivalHour && (
                      <Stack align={'center'} gap={'xs'} fw={'bold'}>
                        <IconPlaneArrival />
                        {format(f.arrival, 'h:mm')}
                      </Stack>
                    )}
                    {hour === departureHour && (
                      <Stack align={'center'} gap={'xs'} fw={'bold'}>
                        <IconPlaneDeparture />
                        {format(f.departure, 'h:mm')}
                      </Stack>
                    )}
                  </Table.Td>
                </Tooltip>
              )
            return <Table.Td key={hour}> </Table.Td>
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
