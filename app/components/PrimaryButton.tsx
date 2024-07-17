import React from 'react'
import { Button } from '@mui/material'

interface PrimaryButtonProps {
  title: string
  type: string
  color: string
  textColor: string
  handleSave?: () => void
  disabled?: boolean
}

const PrimaryButton = ({
  title,
  type,
  handleSave,
  color,
  textColor,
  disabled,
}: PrimaryButtonProps) => {
  const styles: { [key: string]: string } = {
    primary:
      'bg-primary text-black hover:bg-hoverprimary text-m font-semibold rounded-full',
    secondary:
      'bg-secondary text-white hover:bg-hoversecondary text-m font-semibold rounded-full',
    danger:
      'bg-danger text-white hover:bg-hoverdanger text-m font-semibold rounded-full',
  }
  return (
    <Button
      disabled={disabled}
      className={`${styles[color]} ${
        type === 'lg'
          ? 'py-[1.5rem] px-[4rem]'
          : type === 'md'
          ? 'py-[1rem] px-[3rem]'
          : 'py-[1rem] px-[2rem]'
      }`}
      onClick={handleSave}
    >
      {title}
    </Button>
  )
}

export default PrimaryButton
