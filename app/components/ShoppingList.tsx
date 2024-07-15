import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Checkbox, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';

// Mock Context
const Context = React.createContext({
  confirmedMeals: {
    meals: [
      {
        meal: {
          id: 1,
          name: 'Meal 1',
          ingredients: [
            { id: 1, title: 'Ingredient 1', pivot: { quantity: 2 } },
            { id: 2, title: 'Ingredient 2', pivot: { quantity: 1 } }
          ],
          spices: [
            { id: 3, title: 'Spice 1', pivot: { quantity: 1 } }
          ]
        }
      },
      {
        meal: {
          id: 2,
          name: 'Meal 2',
          ingredients: [
            { id: 1, title: 'Ingredient 1', pivot: { quantity: 1 } },
            { id: 3, title: 'Ingredient 3', pivot: { quantity: 3 } }
          ],
          spices: [
            { id: 4, title: 'Spice 2', pivot: { quantity: 2 } }
          ]
        }
      }
    ]
  }
});

// Types
interface Ingredient {
  id: number;
  title: string;
  pivot: {
    quantity: number;
  };
}

interface Meal {
  id: number;
  name: string;
  ingredients: Ingredient[];
  spices: Ingredient[];
}

interface ConfirmedMeal {
  meal: Meal;
}

interface ShoppingListItem {
  id: string; // Use string as ID to uniquely identify ingredients and spices
  text: string;
  completed: boolean;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const context = React.useContext(Context);

  if (!context) {
    throw new Error('ShoppingList must be used within a Context.Provider');
  }

  const { confirmedMeals } = context;

  useEffect(() => {
    const countIngredientsAndSpices = (meals: ConfirmedMeal[]): { ingredients: ShoppingListItem[]; spices: ShoppingListItem[] } => {
      const countedItems = {
        ingredients: [],
        spices: [],
      };

      meals.forEach((confirmedMeal) => {
        // Count ingredients
        confirmedMeal.meal.ingredients.forEach((ingredient: Ingredient) => {
          const { id, title, pivot } = ingredient;
          const ingredientKey = `${id}-${title}`; // Unique key based on id and title
          const existingIndex = countedItems.ingredients.findIndex(item => item.id === ingredientKey);
          if (existingIndex !== -1) {
            countedItems.ingredients[existingIndex].text = `${title} (${countedItems.ingredients[existingIndex].quantity + pivot.quantity})`;
          } else {
            countedItems.ingredients.push({ id: ingredientKey, text: title, completed: false, quantity: pivot.quantity });
          }
        });

        // Count spices
        confirmedMeal.meal.spices.forEach((spice: Ingredient) => {
          const { id, title, pivot } = spice;
          const spiceKey = `${id}-${title}`; // Unique key based on id and title
          const existingIndex = countedItems.spices.findIndex(item => item.id === spiceKey);
          if (existingIndex !== -1) {
            countedItems.spices[existingIndex].text = `${title} (${countedItems.spices[existingIndex].quantity + pivot.quantity})`;
          } else {
            countedItems.spices.push({ id: spiceKey, text: title, completed: false, quantity: pivot.quantity });
          }
        });
      });

      return countedItems;
    };

    const { meals } = confirmedMeals;
    const countedItems = countIngredientsAndSpices(meals);
    console.log('Counted Ingredients:', countedItems.ingredients);
    console.log('Counted Spices:', countedItems.spices);

    // Format items for shopping list
    const shoppingListItems: ShoppingListItem[] = [
      ...countedItems.ingredients.map(item => ({ ...item, text: `${item.text} (${item.quantity})` })),
      ...countedItems.spices.map(item => ({ ...item, text: `${item.text} (${item.quantity})` }))
    ];
    setItems(shoppingListItems);

    // Normally, you would return cleanup logic if necessary
    return () => {
      // Cleanup logic here if any
    };
  }, [confirmedMeals]);

  const handleToggle = (id: string) => () => {
    setItems(items.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  return (
    <div className='w-100'>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ color: 'white', marginBottom: '16px', marginTop: '2.5rem', fontSize: '1.5rem' }}>
          Váš nákupný zoznam
        </Typography>
        <Paper sx={{ padding: '16px', borderRadius: '3xl' }}>
          <List>
            {items.map(item => (
              <ListItem key={item.id} disablePadding className='shadow-sm'>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.completed}
                    tabIndex={-1}
                    disableRipple
                    onChange={handleToggle(item.id)}
                    sx={{
                      color: '#6200ea',
                      '&.Mui-checked': {
                        color: '#6200ea',
                      },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  onClick={handleToggle(item.id)}
                  sx={{
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? 'rgba(0, 0, 0, 0.54)' : 'rgba(0, 0, 0, 0.87)',
                  }}
                  className='text-md cursor-pointer'
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default ShoppingList;