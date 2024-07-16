'use client'
import React, { useState } from 'react'
import Header from './components/Header'
import DaySelector from './components/DaySelector'
import MealSelector from './components/MealSelector'
import { ContextProvider } from './context'
import Summary from './components/Summary'
import ShoppingList from './components/ShoppingList'
import { ConfirmedMeals } from './types'

export default function Home() {
  const [day, setDay] = useState('1')
  const daySelectorRef = React.useRef<HTMLDivElement>(null)
  return (
    <>
      <Header />
      <ContextProvider>
        <main className="max-w-screen-xl mx-auto px=[1rem]">
          <DaySelector
            activeDay={day}
            activeDayHandler={setDay}
            selectorRef={daySelectorRef}
          />
          <MealSelector
            day={day}
            activeDayHandler={setDay}
            selectorRef={daySelectorRef}
          />
          <Summary />
          <ShoppingList />
        </main>
      </ContextProvider>
    </>
  )
}
