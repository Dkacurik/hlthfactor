import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Checkbox, List, ListItem, ListItemText, ListItemIcon, Grid } from '@mui/material';
import { Context } from '../context';
import { Ingredient, Meal } from '../types';

interface ConfirmedMeal {
  meal: Meal;
}

interface ShoppingListItem {
  id: string; // Use string as ID to uniquely identify ingredients and spices
  text: string;
  completed: boolean;
  quantity: number;
  unit?: string;
}

const ShoppingList = () => {
  const [ingredientsList, setIngredientsList] = useState<ShoppingListItem[]>([]);
  const [spices, setSpicesList] = useState<ShoppingListItem[]>([]);

  const context = React.useContext(Context);

  if (!context) {
    throw new Error('ShoppingList must be used within a Context.Provider');
  }

  const { confirmedMeals } = context;

  useEffect(() => {
    const countIngredientsAndSpices = (meals: ConfirmedMeal[]): { ingredients: ShoppingListItem[]; spices: ShoppingListItem[] } => {
      const countedItems = {
        ingredients: [] as ShoppingListItem[],
        spices: [] as ShoppingListItem[],
      };

      meals.forEach((confirmedMeal) => {
        // Count ingredients
        confirmedMeal.meal.ingredients.forEach((ingredient: Ingredient) => {
          const { id, title, pivot } = ingredient;
          const ingredientKey = `${id}-${title}`; // Unique key based on id and title
          const existingIndex = countedItems.ingredients.findIndex(item => item.id === ingredientKey);
          if (existingIndex !== -1) {
            countedItems.ingredients[existingIndex].text = `${countedItems.ingredients[existingIndex].quantity + pivot.quantity} ${countedItems.ingredients[existingIndex].unit} - ${title}`;
          } else {
            countedItems.ingredients.push({ id: ingredientKey, text: `${pivot.quantity} ${ingredient.unit} - ${title}`, completed: false, quantity: pivot.quantity, unit: ingredient.unit });
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
    const ingredientsListItems: ShoppingListItem[] = [
      ...countedItems.ingredients.map(item => ({ ...item, text: `${item.text}` })),
    ];
    const spicesListItems: ShoppingListItem[] = [
      ...countedItems.spices.map(item => ({ ...item, text: `${item.text}` }))
    ];
    setIngredientsList(ingredientsListItems);
    setSpicesList(spicesListItems);

    // Normally, you would return cleanup logic if necessary
    return () => {
      // Cleanup logic here if any
    };
  }, [confirmedMeals]);

  const handleToggle = (id: string) => () => {
    setIngredientsList(ingredientsList.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)));
    setSpicesList(spices.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)));

  };

  return (
    <div className='w-100'>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ color: 'white', marginBottom: '16px', marginTop: '2.5rem', fontSize: '1.5rem' }}>
          Váš nákupný zoznam
        </Typography>
        <Paper sx={{ padding: '16px', borderRadius: '3xl' }}>
        {ingredientsList.length > 0 ? (
          <>
          <Typography className='text-m font-semibold'>INGREDIENCIE</Typography>
          <List>
            <Grid container spacing={2}>
            {ingredientsList.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <ListItem disablePadding className='shadow-sm'>
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
              </Grid>
            ))}
          </Grid>
          </List>
          {spices.length > 0 && (
            <>
            <Typography className='text-m font-semibold mt-5'>DOCHUCOVADLÁ</Typography>
            <List>
            <Grid container spacing={2}>
            {spices.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <ListItem disablePadding className='shadow-sm'>
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
              </Grid>
            ))}
          </Grid>
            </List>
            </>
          )}
          </>): <Typography className='text-m'>Nemáte žiadne položky v nákupnom zozname</Typography>}
        
        </Paper>
      </Box>
    </div>
  );
};

export default ShoppingList;