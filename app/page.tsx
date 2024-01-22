import { Badge, Button, Center, Flex, Group, Stack, Title } from '@mantine/core'
import DaySchedule from '@/components/day-schedule'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Flight } from '@prisma/client'
import { endOfDay, format, getHours, startOfDay } from 'date-fns'
import { UTCDate } from '@date-fns/utc'
import StatCard from '@/components/stat-card'
import DayFilter from '@/components/day-filter'

const colors = [
  '#F76D6D',
  '#64C1FF',
  '#A2E67E',
  '#E7E17C',
  '#FFCA64',
  '#AC7CE8',
]
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]
const setFlightsColor = (flights: Flight[]) => {
  let lastColor = ''
  return flights.map((f) => {
    let _color = randomColor()
    while (_color === lastColor) {
      _color = randomColor()
    }
    lastColor = _color
    return { ...f, color: _color }
  })
}

export default async function Home({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const _day = searchParams?.date
    ? new UTCDate(searchParams.date)
    : new UTCDate()
  const _sod = startOfDay(_day)
  const _eod = endOfDay(_day)

  const flights = await prisma.flight.findMany({
    orderBy: {
      name: 'asc',
    },
    where: {
      OR: [
        {
          departure: {
            gte: _sod,
            lte: _eod,
          },
        },
        {
          arrival: {
            gte: _sod,
            lte: _eod,
          },
        },
      ],
    },
  })

  const _totalFlights = flights.length
  const busiestHours = () => {
    const _flights = flights.map((f) => {
      const arrivalHour = f.arrival ? getHours(f?.arrival) : 0
      const departureHour = f.departure ? getHours(f?.departure) : 23
      return { arrivalHour, departureHour }
    })
    const _hours = [...Array(24)].map((_, i) => {
      const _hour = i
      const _flightsInHour = _flights.filter((f) => {
        return f.arrivalHour <= _hour && f.departureHour >= _hour
      })
      return { hour: _hour, flights: _flightsInHour.length }
    })
    const _maxFlights = Math.max(..._hours.map((h) => h.flights))
    return _hours.filter((h) => h.flights === _maxFlights)
  }

  return (
    <main>
      <Stack>
        <Flex justify={'space-between'}>
          <Group>
            <Title order={3}>Schedule</Title>
            <Badge variant={'default'}>{format(_day, 'MM/dd/yyyy')}</Badge>
          </Group>

          <Group>
            <DayFilter />
            <Button component={Link} href={'/flights/add'}>
              Add Flight
            </Button>
          </Group>
        </Flex>
        {flights.length > 0 ? (
          <DaySchedule flights={setFlightsColor(flights)} />
        ) : (
          <Center mt={'lg'}>
            <Title order={4}>No flights for this day</Title>
          </Center>
        )}

        {flights.length > 0 && (
          <Group>
            <StatCard
              title={'Total Flights'}
              value={_totalFlights.toString()}
            />
            <StatCard
              title={'Busiest Hours'}
              value={busiestHours()
                .map((h) => h.hour)
                .join(', ')}
            />
          </Group>
        )}
      </Stack>
    </main>
  )
}
