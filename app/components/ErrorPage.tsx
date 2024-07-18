import { Container, Typography } from '@mui/material'
import Image from 'next/image'
import { useContext } from 'react'
import { Context } from '../context'

const ErrorPage = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }

  const { isError } = context

  return (
    <Container className="w-[100vw] h-[100vh] flex flex-col justify-center content-center">
      <Image src="/logo.svg" width={362} height={114} alt="HLTH Factor logo" />
      <Typography variant="h1" component="h1" gutterBottom>
        404 - Stránka sa nenašla
      </Typography>
      <Typography variant="body1" gutterBottom>
        Stránka, ktorú hľadáte, sa nenašla. Skontrolujte, či je adresa správne
        zadaná.
      </Typography>
    </Container>
  )
}

export default ErrorPage
