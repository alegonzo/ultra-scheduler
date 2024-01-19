import FlightForm from '@/components/flight-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditFlightPage({
  params,
}: {
  params: { id: string }
}) {
  const flight = await prisma.flight.findFirst({
    where: {
      id: params.id,
    },
  })
  if (!flight) return notFound()

  return <FlightForm flight={flight} />
}
