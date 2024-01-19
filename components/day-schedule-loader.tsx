import { Box, Flex, Skeleton, Stack } from '@mantine/core'

export default function DayScheduleLoader() {
  return (
    <Stack gap={'md'}>
      <Flex justify={'space-between'}>
        <Skeleton height={30} radius="sm" mt={'md'} width={150} />
        <Skeleton height={30} radius="sm" mt={'md'} width={120} />
      </Flex>
      <Box>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
          <Skeleton key={index} height={25} radius="md" mt={'lg'} />
        ))}
      </Box>
    </Stack>
  )
}
