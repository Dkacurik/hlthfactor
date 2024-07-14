'use client'
import React, {useState} from 'react'
import Header from './components/Header'
import DaySelector from './components/DaySelector';
import MealSelector from './components/MealSelector';
import { ContextProvider } from './context';
import Summary from './components/Summary';
import ShoppingList from './components/ShoppingList';

export default function Home() {
  const [day, setDay] = useState('1')
  return (
    <>
      <Header />
      <ContextProvider>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <DaySelector activeDay={day} activeDayHandler={setDay}/>
          <MealSelector day={day}/>
          <Summary />
          <ShoppingList />
        </main>
      </ContextProvider>
    </>
  )
}
