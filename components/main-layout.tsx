'use client'
import { ReactNode } from 'react'
import { Container, Group, Burger, AppShell, Flex, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

type Props = {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  const pathname = usePathname()
  const [opened, { toggle }] = useDisclosure(false)

  const items = [
    <Link key={1} href={'/'} data-active={pathname === '/' || undefined}>
      Inicio
    </Link>,
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Container size="md" mt={'sm'}>
          <Flex justify={'space-between'}>
            <Title order={3}>Ultra Scheduler</Title>
            <UserButton />
          </Flex>
        </Container>
      </AppShell.Header>

      <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

      <AppShell.Navbar p="md" withBorder={false}></AppShell.Navbar>
      <AppShell.Main>
        <Container>{children}</Container>
      </AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  )
}
