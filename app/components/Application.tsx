import React, { useState, useRef, useContext, use, useEffect } from 'react'
import Summary from './Summary'
import ShoppingList from './ShoppingList'
import ErrorPage from './ErrorPage'
import Header from './Header'
import DaySelector from './DaySelector'
import MealSelector from './MealSelector'
import { Context } from '../context'
import LoaderPage from './Loader'

const Application = () => {
  const daySelectorRef = useRef<HTMLDivElement>(null)
  const {
    isError,
    isLoad,
    day,
    setDay,
    confirmedMeals,
    setIsError,
    setIsLoad,
    setConfirmedMeals,
  } = useContext(Context)

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
