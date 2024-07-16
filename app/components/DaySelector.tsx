'use client'
import React, { MouseEvent } from 'react'
import Stack from '@mui/material/Stack'
import ButtonPill from './ButtonPill'
import { Context } from '../context'

interface DaySelectorProps {
  activeDay: string
  activeDayHandler: (day: string) => void
  selectorRef: React.RefObject<HTMLDivElement>
}

const DaySelector = ({
  activeDay,
  activeDayHandler,
  selectorRef,
}: DaySelectorProps) => {
  const [confirmed, setConfirmed] = React.useState<string[]>([])

  const days = ['1', '2', '3', '4', '5']
  const context = React.useContext(Context)

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }

  const { confirmedMeals } = context

  React.useEffect(() => {
    confirmedMeals.meals.forEach((meal) => {
      setConfirmed((prev) => [...prev, `btn-${meal.day}`])
    })
  }, [confirmedMeals])

  const handleClick =
    (day: string) => (event: MouseEvent<HTMLButtonElement>) => {
      activeDayHandler(day)
    }
  return (
    <div ref={selectorRef}>
      <h2 className="mt-[2.5rem] text-l">Naplánujte si jednotlivé dni</h2>
      <Stack
        direction={{ sm: 'row', xs: 'column' }}
        spacing={2}
        className="mt-[1.5rem]"
      >
        {days.map((day) => (
          <ButtonPill
            state={
              day === activeDay
                ? 'active'
                : confirmed.includes(`btn-${day}`)
                ? 'used'
                : 'inactive'
            }
            key={day}
            onClick={handleClick(day)}
          >
            {day}. DEŇ
          </ButtonPill>
        ))}
      </Stack>
    </div>
  )
}

export default DaySelector
