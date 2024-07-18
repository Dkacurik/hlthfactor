'use client'
import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import DaySelector from './components/DaySelector'
import MealSelector from './components/MealSelector'
import { Context, ContextProvider } from './context'
import Summary from './components/Summary'
import ShoppingList from './components/ShoppingList'
import Application from './components/Application'

export default function Home() {
  const [day, setDay] = useState('1')
  const daySelectorRef = React.useRef<HTMLDivElement>(null)
  const context = React.useContext(Context)

  // useEffect(() => {
  //   setTimeout(() => {
  //     setDay('1')
  //   }, 500)
  // }, [])
  // return (
  //   <>
  //     <Header />
  //     <ContextProvider>
  //       <main className="max-w-screen-xl mx-auto px-[1rem]">
  //         <DaySelector
  //           activeDay={day}
  //           activeDayHandler={setDay}
  //           selectorRef={daySelectorRef}
  //         />
  //         <MealSelector
  //           day={day}
  //           activeDayHandler={setDay}
  //           selectorRef={daySelectorRef}
  //         />
  //         <Summary />
  //         <ShoppingList />
  //       </main>
  //     </ContextProvider>
  //   </>
  // )
  return (
    <>
      <ContextProvider>
        <Application />
      </ContextProvider>
    </>
  )
}
