export interface Ingredient {
  id: number;
  title: string;
  unit: string;
  pivot: {
    quantity: number;
    category: string | null;
  };
}

export interface GroupedIngredients {
  [category: string]: Ingredient[];
}

export interface Meal {
  title: string;
  description: string;
  time_of_preparation: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  ingredients: Ingredient[];
  spices: Ingredient[];
  groupedIngredients?: GroupedIngredients;
  groupedSpices?: GroupedIngredients;
}

export interface ConfirmedMeal {
    meal: Meal;
    day: string;
    mealCategory: string;

}

export interface ConfirmedMeals {
    meals: ConfirmedMeal[];
}

export enum MealCategory {
    Raňajky = 'BREAKFAST',
    Desiata = 'SNACK',
    Olovrant = 'SNACK',
    Obed = 'LUNCH',
    Večera = 'DINNER',
  }
  
export interface MealOptionProps {
    day: string;
    mealCategory: MealCategory;
}

export interface ShoppingListItem {

}
  
export interface ShoppingListItems{
    ingredients: Ingredient[];
    spices: Ingredient[];
}