import { z } from 'zod'

export const createFlightSchema = z
  .object({
    name: z.string().min(2),
    arrival: z.date().nullable(),
    departure: z.date().nullable(),
  })
  .refine(
    (data) => {
      return !!data.arrival || !!data.departure
    },
    {
      message: 'Most be an arrival or departure date',
      path: ['arrival-departure'],
    },
  )
export type CreateFlight = z.infer<typeof createFlightSchema>

export const updateFlightSchema = z
  .object({
    id: z.string().min(2),
    name: z.string().min(2),
    arrival: z.date().nullable(),
    departure: z.date().nullable(),
  })
  .refine(
    (data) => {
      return !!data.arrival && !!data.departure
    },
    {
      message: 'Most be an arrival or departure date',
      path: ['arrival'],
    },
  )
export type UpdateFlight = z.infer<typeof updateFlightSchema>
