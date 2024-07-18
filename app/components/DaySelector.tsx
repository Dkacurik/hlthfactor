import React, { MouseEvent, useEffect, useRef } from 'react'
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
  const stackRef = useRef<HTMLDivElement>(null) // Ref for the Stack component

  const days = ['1', '2', '3', '4', '5']
  const context = React.useContext(Context)

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }

  const { confirmedMeals } = context

  useEffect(() => {
    confirmedMeals.meals.forEach((meal) => {
      setConfirmed((prev) => [...prev, `btn-${meal.day}`])
    })
  }, [confirmedMeals])

  useEffect(() => {
    if (stackRef.current) {
      const buttonPill = stackRef.current.querySelector(`.btn-${activeDay}`)
      if (buttonPill) {
        buttonPill.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [activeDay])

  const handleClick =
    (day: string) => (event: MouseEvent<HTMLButtonElement>) => {
      activeDayHandler(day)
    }

  return (
    <div ref={selectorRef}>
      <h2 className="mt-[2.5rem] text-l">Naplánujte si jednotlivé dni</h2>
      <Stack
        ref={stackRef}
        direction={{ sm: 'row', xs: 'row' }}
        spacing={2}
        className="mt-[1.5rem] overflow-x-scroll no-scrollbar"
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
            className={`btn-${day}`} // Add class for each ButtonPill element
          >
            {day}. DEŇ
          </ButtonPill>
        ))}
      </Stack>
    </div>
  )
}

export default DaySelector
