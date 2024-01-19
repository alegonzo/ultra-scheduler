'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CreateFlight, UpdateFlight } from '@/lib/types'
import { redirect } from 'next/navigation'

export const createFlight = async (flight: CreateFlight) => {
  await prisma.flight.create({
    data: flight,
  })
  revalidatePath('/')
  redirect('/')
}

export const updateFlight = async (flight: UpdateFlight) => {
  await prisma.flight.update({
    where: { id: flight.id },
    data: flight,
  })
  revalidatePath(`/flights/${flight.id}/edit`)
  revalidatePath('/')
  redirect('/')
}

export const deleteFlight = async (id: string) => {
  await prisma.flight.delete({
    where: { id },
  })
  revalidatePath('/')
  redirect('/')
}
