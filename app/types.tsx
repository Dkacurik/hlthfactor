export interface Ingredient {
  id: number
  title: string
  unit: string
  pivot: {
    quantity: number
    category: string | null
  }
}

export interface GroupedIngredients {
  [category: string]: Ingredient[]
}

export interface Meal {
  id: number
  title: string
  description: string
  time_of_preparation: string
  calories: number
  proteins: number
  carbs: number
  fats: number
  ingredients: Ingredient[]
  spices: Ingredient[]
  groupedIngredients?: GroupedIngredients
  groupedSpices?: GroupedIngredients
  category: string
}

export interface ConfirmedMeal {
  meal: Meal
  day: string
  mealCategory: string
}

export interface ConfirmedMeals {
  meals: ConfirmedMeal[]
}

export enum MealCategory {
  Raňajky = 'BREAKFAST',
  Desiata = 'SNACK',
  Obed = 'LUNCH',
  Olovrant = 'BRUNCH',
  Večera = 'DINNER',
}

export interface MealOptionProps {
  day: string
  mealCategory: MealCategory
}

export interface ShoppingListItem {
  id: string // Use string as ID to uniquely identify ingredients and spices
  text: string
  completed: boolean
  quantity: number
  unit?: string
}

export interface ShoppingListItems {
  ingredients: Ingredient[]
  spices: Ingredient[]
}
