import { z } from 'zod'

export const createFlightSchema = z.object({
  name: z.string().min(2),
  arrival: z.date().nullable(),
  departure: z.date().nullable(),
})
/*.refine(
    (data) => {
      console.log(data)
      if (!data.arrival && !data.departure) return true
    },
    {
      message: 'Most be an arrival or departure date',
      path: ['arrival', 'departure'],
    },
  )*/
export type CreateFlight = z.infer<typeof createFlightSchema>

export const updateFlightSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  arrival: z.date().nullable(),
  departure: z.date().nullable(),
})
/*.refine(
    (data) => {
      if (!data.arrival && !data.departure) return true
    },
    {
      message: 'There most be an arrival or departure date',
      path: ['arrival', 'departure'],
    },
  )*/
export type UpdateFlight = z.infer<typeof updateFlightSchema>
