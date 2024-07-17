import React, { ReactNode, MouseEventHandler } from 'react'
import { Button } from '@mui/material'

interface ButtonPillProps {
  children: ReactNode
  state: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

const ButtonPill = ({
  children,
  state,
  onClick,
}: ButtonPillProps): JSX.Element => {
  return (
    <Button
      onClick={onClick}
      className={
        'px-[2rem] py-[1rem] text-m font-semibold rounded-full hover:bg-primary hover:text-black min-w-[120px]' +
        (state === 'active'
          ? ' bg-primary text-black'
          : state === 'used'
          ? ' btn-used'
          : ' bg-secondary text-white')
      }
    >
      {children}
    </Button>
  )
}

export default ButtonPill
