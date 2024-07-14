import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export interface Calories {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

interface ContextProps {
  calories: Calories;
  setCalories: Dispatch<SetStateAction<Calories>>;
}

export const Context = createContext<ContextProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const ContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [calories, setCalories] = useState<Calories>({ calories: 0, proteins: 0, carbs: 0, fats: 0 });

  return (
    <Context.Provider value={{ calories, setCalories }}>
      {children}
    </Context.Provider>
  );
};
