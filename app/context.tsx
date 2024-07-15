import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { ConfirmedMeals } from './types';

export interface Calories {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

interface ContextProps {
  calories: Calories;
  setCalories: Dispatch<SetStateAction<Calories>>;
  confirmedMeals: ConfirmedMeals;
  setConfirmedMeals: Dispatch<SetStateAction<ConfirmedMeals>>;
}

export const Context = createContext<ContextProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const ContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [calories, setCalories] = useState<Calories>({ calories: 0, proteins: 0, carbs: 0, fats: 0 });
  const [confirmedMeals, setConfirmedMeals] = useState<ConfirmedMeals>({ meals: [] });

  return (
    <Context.Provider value={{ calories, setCalories, confirmedMeals, setConfirmedMeals }}>
      {children}
    </Context.Provider>
  );
};
