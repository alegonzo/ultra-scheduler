'use client'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useRouter } from 'next/navigation'
import { createFlight, updateFlight } from '@/app/_actions'
import { notifications } from '@mantine/notifications'
import { Button, Flex, Modal, Stack, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import {
  CreateFlight,
  createFlightSchema,
  UpdateFlight,
  updateFlightSchema,
} from '@/lib/types'
import { Flight } from '@prisma/client'

type FormValues = CreateFlight | UpdateFlight
type Props = {
  flight?: Flight
}

export default function FlightForm({ flight }: Props) {
  const router = useRouter()
  const form = useForm<FormValues>({
    initialValues: {
      id: flight?.id,
      name: flight?.name || '',
      arrival: flight?.arrival || null,
      departure: flight?.departure || null,
    },
    validate: zodResolver(flight ? updateFlightSchema : createFlightSchema),
  })
  console.log(form.errors)

  const onSubmit = async (values: FormValues) => {
    try {
      if (flight) {
        await updateFlight(values as UpdateFlight)
        notifications.show({
          title: 'Flight updated',
          color: 'green',
          message: 'Action successfully completed',
        })
      } else {
        await createFlight(values)
        notifications.show({
          title: 'Flight created',
          color: 'green',
          message: 'Action successfully completed',
        })
      }
      // router.back()
    } catch (e: any) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: e?.message as string,
      })
    }
  }

  return (
    <Modal
      opened={true}
      onClose={() => router.back}
      title={`${flight ? 'Update' : 'Create'} Flight`}
      size={'xl'}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={'lg'} mt={'lg'}>
          <TextInput label="Nombre" {...form.getInputProps('name')} />
          <DateTimePicker label="Arrival" {...form.getInputProps('arrival')} />
          <DateTimePicker
            label="Departure"
            {...form.getInputProps('departure')}
          />

          <Flex gap={'sm'} mt={'lg'}>
            <Button type="submit">Accept</Button>
            <Button onClick={() => router.back()}>Cancel</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  )
}
