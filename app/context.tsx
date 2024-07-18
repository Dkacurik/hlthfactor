import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import { ConfirmedMeals } from './types'
import { getSavedMeals } from './api'

export interface Calories {
  calories: number
  proteins: number
  carbs: number
  fats: number
}

interface ContextProps {
  calories: Calories
  setCalories: Dispatch<SetStateAction<Calories>>
  confirmedMeals: ConfirmedMeals
  setConfirmedMeals: Dispatch<SetStateAction<ConfirmedMeals>>
}

export const Context = createContext<ContextProps | undefined>(undefined)

interface ProviderProps {
  children: ReactNode
}

export const ContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [calories, setCalories] = useState<Calories>({
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
  })
  const [confirmedMeals, setConfirmedMeals] = useState<ConfirmedMeals>({
    meals: [],
  })

  useEffect(() => {
    async function tmp() {
      const savedMeals = await getSavedMeals('sdgfaljdfhlkjashdflkjhasdfjkha')
      setConfirmedMeals(savedMeals)
      savedMeals.meals.forEach((meal) => {
        setCalories((prev) => ({
          calories: prev.calories + meal.meal.calories,
          proteins: prev.proteins + meal.meal.proteins,
          carbs: prev.carbs + meal.meal.carbs,
          fats: prev.fats + meal.meal.fats,
        }))
      })
    }
    tmp()
  }, []) // Empty dependency
  return (
    <Context.Provider
      value={{ calories, setCalories, confirmedMeals, setConfirmedMeals }}
    >
      {children}
    </Context.Provider>
  )
}
