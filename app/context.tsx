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
  isLoad: boolean
  setIsLoad: Dispatch<SetStateAction<boolean>>
  isError: boolean
  setIsError: Dispatch<SetStateAction<boolean>>
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
  const [isLoad, setIsLoad] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    async function tmp() {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      if (!token) {
        setIsLoad(false)
        setIsError(true)
        return
      }
      try {
        const savedMeals = await getSavedMeals(token)
        savedMeals.meals.forEach((meal) => {
          setCalories((prev) => ({
            calories: prev.calories + meal.meal.calories,
            proteins: prev.proteins + meal.meal.proteins,
            carbs: prev.carbs + meal.meal.carbs,
            fats: prev.fats + meal.meal.fats,
          }))
        })
        setConfirmedMeals(savedMeals)
        setTimeout(() => {
          setIsLoad(false)
        }, 500)
      } catch (e) {
        setIsLoad(false)
        setIsError(true)
      }
    }
    tmp()
  }, []) // Empty dependency
  return (
    <Context.Provider
      value={{
        calories,
        setCalories,
        confirmedMeals,
        setConfirmedMeals,
        isLoad,
        setIsLoad,
        isError,
        setIsError,
      }}
    >
      {children}
    </Context.Provider>
  )
}
