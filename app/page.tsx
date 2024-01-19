import { Badge, Button, Flex, Group, Stack, Title } from '@mantine/core'
import DaySchedule from '@/components/day-schedule'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Flight } from '@prisma/client'
import { endOfDay, format, startOfDay } from 'date-fns'

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
  //console.log(lastColor)
  return flights.map((f) => {
    let _color = randomColor()
    while (_color === lastColor) {
      _color = randomColor()
      lastColor = _color
    }
    return { ...f, color: _color }
  })
}

export default async function Home() {
  const _sod = startOfDay(new Date())
  const _eod = endOfDay(new Date())

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

  return (
    <main>
      <Stack>
        <Flex justify={'space-between'}>
          <Group>
            <Title order={3}>Schedule</Title>
            <Badge variant={'default'}>
              {format(new Date(), 'MM/dd/yyyy')}
            </Badge>
          </Group>

          <Button component={Link} href={'/flights/add'}>
            Add Flight
          </Button>
        </Flex>
        <DaySchedule flights={setFlightsColor(flights)} />
      </Stack>
    </main>
  )
}
