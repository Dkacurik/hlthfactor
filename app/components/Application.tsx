import React, { useState, useRef, useContext, use, useEffect } from 'react'
import Summary from './Summary'
import ShoppingList from './ShoppingList'
import Header from './Header'
import DaySelector from './DaySelector'
import MealSelector from './MealSelector'
import { Context } from '../context'
import LoaderPage from './Loader'
import ErrorPage from './ErrorPage'

const Application = () => {
  const [day, setDay] = useState('1')
  const daySelectorRef = useRef<HTMLDivElement>(null)
  const context = useContext(Context)
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider')
  }

  const { isError, isLoad } = context

  useEffect(() => {
    setTimeout(() => {
      setDay('1')
    }, 500)
  })

  return (
    <>
      {isLoad ? (
        <LoaderPage />
      ) : !isError ? (
        <>
          <Header />
          <main className="max-w-screen-xl mx-auto px-[1rem]">
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
        </>
      ) : (
        <ErrorPage />
      )}
    </>
  )
}

export default Application
