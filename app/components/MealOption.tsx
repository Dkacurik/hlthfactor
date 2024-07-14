import React, { useState, useEffect, useContext } from 'react';
import { Grid, Paper, Box, Typography, Radio } from '@mui/material';
import PrimaryButton from './PrimaryButton';
import { Context } from '../context';

enum MealCategory {
  Raňajky = 'BREAKFAST',
  Desiata = 'SNACK',
  Obed = 'LUNCH',
  Večera = 'DINNER',
}

interface Ingredient {
  title: string;
  unit: string;
  pivot: {
    quantity: number;
  };
}

interface Meal {
  title: string;
  description: string;
  time_of_preparation: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  ingredients: Ingredient[];
}

interface MealOptionProps {
  day: string;
  mealCategory: MealCategory;
}



const MealOption: React.FC<MealOptionProps> = ({ day, mealCategory}) => {
  const [selectedMeal, setSelectedMeal] = useState<number | null>(0); // Track selected meal index
  const [mealOption, setMealOption] = useState<Meal[]>([]); // State for meals fetched from API
  const [confirmedMeal, setConfirmedMeal] = useState<Meal | null>(null); // Track confirmed meal
  const context = useContext(Context);

  if (!context) {
    throw new Error('MealSelector must be used within a Context.Provider');
  }

  const { calories, setCalories } = context;

  useEffect(() => {
    fetch(`http://localhost:8000/api/meals/${day}/${mealCategory}`)
      .then(response => response.json())
      .then(data => {
        // Assuming data is an array of Meal objects
        setMealOption(data); // Update mealOption state with fetched data
      })
      .catch(error => {
        console.error('Error fetching meals:', error);
      });
  }, [day, mealCategory]);

  const caloriesHandler = () => {
    if(selectedMeal === null) return;

    const confirmedMeal = mealOption[selectedMeal];

    if(confirmedMeal !== null) {
      calories.calories += confirmedMeal.calories;
      calories.proteins += confirmedMeal.proteins;
      calories.carbs += confirmedMeal.carbs;
      calories.fats += confirmedMeal.fats;
      setCalories(calories);
    }
  }

  return (
    <div className='m-[1.5rem]'>

      <Box>
        <Grid container spacing={2}>
          {mealOption.map((meal: Meal, index) => (
            <Grid item xs={12} sm={4} key={meal.title}>
              <Paper
                sx={{
                  p: 2,
                }}
                className={`cursor-pointer rounded-3xl ${selectedMeal === index ? 'bg-secondary text-white' : 'bg-white text-black'}`}
                onClick={() => setSelectedMeal(index)}
              >
                <Box display="flex" alignItems="center">
                  <Radio
                    checked={selectedMeal === index}
                    onChange={() => setSelectedMeal(index)}
                    color="default"
                    className={selectedMeal === index ? 'text-primary' : 'text-secondary'}
                    name="meal-options"
                  />
                  <Box ml={1}>
                    <Typography className={`text-[1.250rem] font-semibold ${selectedMeal === index ? 'text-primary' : 'text-black'}`}>{meal.title}</Typography>
                    <Typography className='text-m'>{meal.time_of_preparation}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {selectedMeal !== null && mealOption.length > 1 && (
          <Box mt={4}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <Typography className='text-m font-semibold'>INGREDIENCIE</Typography>
                <ul className='list-disc pl-[1rem]'>
                  {mealOption[selectedMeal].ingredients.map((ingredient, idx) => (
                    <li key={idx}>
                      <Typography className='leading-6'>{ingredient.title}</Typography>
                    </li>
                  ))}
                </ul>
                {/* <Typography className='mt-[1rem]'>{mealOptions[selectedMeal].ingredient_recommendation}</Typography> */}
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography className='text-m font-semibold mb-[1rem]'>POSTUP</Typography>
                <Typography>{mealOption[selectedMeal].description}</Typography>
                <Box mt={6}>
                  <Typography className='text-m font-semibold mb-[1rem]'>KALORICKÉ HODNOTY</Typography>
                  <Typography>Kcal = {mealOption[selectedMeal].calories}</Typography>
                  <Typography>Proteins = {mealOption[selectedMeal].proteins}</Typography>
                  <Typography>Carbs = {mealOption[selectedMeal].carbs}</Typography>
                  <Typography>Fats = {mealOption[selectedMeal].fats}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box mt={4} textAlign="center">
          <PrimaryButton type='md' title='Potvrdiť' handleSave={caloriesHandler}/>
        </Box>
      </Box>
    </div>
  );
};

export default MealOption;
