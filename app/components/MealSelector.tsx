'use client'
import * as React from 'react'
import { styled } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import MealOption from './MealOption'
import { Context } from '../context'
import { ConfirmedMeals, MealCategory } from '../types'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}))

interface MealSelectorProps {
  day: string
  activeDayHandler: (day: string) => void
  selectorRef: React.RefObject<HTMLDivElement>
}

export default function CustomizedAccordions({
  day,
  activeDayHandler,
  selectorRef,
}: MealSelectorProps) {
  const meals = ['Raňajky', 'Desiata', 'Obed', 'Olovrant', 'Večera']
  const [expanded, setExpanded] = React.useState<string | false>('')
  const [confirmed, setConfirmed] = React.useState<string[]>([])
  const [blockExpanse, setBlockExpanse] = React.useState<boolean>(false)

  const summaryRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  function getNextMealCategoryKey(
    currentCategory: keyof typeof MealCategory
  ): keyof typeof MealCategory | null {
    const categories = Object.keys(MealCategory) as Array<
      keyof typeof MealCategory
    >
    const tmp = currentCategory
      .toString()
      .split('-')[2] as keyof typeof MealCategory
    const currentIndex = categories.indexOf(tmp)

    if (currentIndex === -1 || currentIndex === categories.length - 1) {
      // Return null if the current category is not found or it is the last category
      activeDayHandler(parseInt(day) + 1 > 5 ? '5' : `${parseInt(day) + 1}`)
      selectorRef.current?.scrollIntoView({ behavior: 'smooth' })
      return null
    }

    return categories[currentIndex + 1]
  }

  const context = React.useContext(Context)
  if (!context) {
    throw new Error('MealSelector must be used within a Context.Provider')
  }

  const { confirmedMeals } = context

  React.useEffect(() => {
    let tmp: string[] = []
    confirmedMeals.meals.forEach((meal, idx) => {
      if (confirmedMeals.meals.length - 1 === idx && !blockExpanse) {
        setExpanded(
          `panel-${meal.day}-${getNextMealCategoryKey(
            expanded as keyof typeof MealCategory
          )}`
        )
      }
      tmp.push(`panel-${meal.day}-${meal.mealCategory}`)
    })
    setBlockExpanse(false)
    setConfirmed(tmp)
  }, [confirmedMeals])

  React.useEffect(() => {
    if (expanded) {
      const summaryRef = summaryRefs.current[expanded]
      if (summaryRef) {
        setTimeout(() => {
          summaryRef.scrollIntoView({ behavior: 'smooth' })
        }, 450) // Adjust the timeout as needed to ensure the panel has fully expanded
      }
    }
  }, [expanded])

  return (
    <div className="mt-[2.5rem]">
      {meals.map((meal, idx) => (
        <Accordion
          expanded={expanded === `panel-${day}-${meal}`}
          onChange={handleChange(`panel-${day}-${meal}`)}
          className="bg-transparent border-0"
          key={`panel-${day}-${meal}`}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                className={
                  expanded === `panel-${day}-${meal}`
                    ? 'text-black'
                    : confirmed.some(
                        (panel) =>
                          panel ===
                          `panel-${day}-${
                            MealCategory[meal as keyof typeof MealCategory]
                          }`
                      )
                    ? 'accordeon-used'
                    : 'text-white'
                }
              />
            }
            aria-controls="panel1d-content"
            id="panel1d-header"
            ref={(el) => {
              summaryRefs.current[`panel-${day}-${meal}`] = el
            }}
            className={
              expanded === `panel-${day}-${meal}`
                ? 'bg-primary text-black rounded-t-3xl mt-[1rem]'
                : confirmed.some(
                    (panel) =>
                      panel ===
                      `panel-${day}-${
                        MealCategory[meal as keyof typeof MealCategory]
                      }`
                  )
                ? 'accordeon-used rounded-3xl mb-[0.5rem] drop-shadow-xl'
                : 'bg-secondary text-white rounded-3xl mb-[0.5rem] drop-shadow-xl'
            }
          >
            <Typography className="text-[1.250rem]">{meal}</Typography>
          </AccordionSummary>
          <AccordionDetails
            className={
              expanded === `panel-${day}-${meal}`
                ? `bg-white text-black rounded-b-3xl mb-[1rem]`
                : 'bg-white'
            }
          >
            <MealOption
              day={day}
              mealCategory={MealCategory[meal as keyof typeof MealCategory]}
              expanded={expanded}
              handleBlockExpanse={setBlockExpanse}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
