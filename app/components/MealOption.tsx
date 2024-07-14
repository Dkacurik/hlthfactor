import React, { useState, useEffect, useContext } from 'react';
import { Grid, Paper, Box, Typography, Radio } from '@mui/material';
import PrimaryButton from './PrimaryButton';
import { Context } from '../context';

enum MealCategory {
  Raňajky = 'BREAKFAST',
  Desiata = 'SNACK',
  Olovrant = 'SNACK',
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
  spices: Ingredient[];
}

interface MealOptionProps {
  day: string;
  mealCategory: MealCategory;
}



const MealOption: React.FC<MealOptionProps> = ({ day, mealCategory}) => {
  const [selectedMeal, setSelectedMeal] = useState<number | null>(0); // Track selected meal index
  const [mealOption, setMealOption] = useState<Meal[]>([]); // State for meals fetched from API
  const [confirmedMeal, setConfirmedMeal] = useState<Meal | null>(null); // Track confirmed meal
  const [spices, setSpices] = useState<Ingredient[]>([]); // Track spices
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
        data.forEach((meal: Meal) => {
          meal.spices = meal.ingredients.filter((ingredient: Ingredient) => ingredient.unit === 'spice');
          meal.ingredients = meal.ingredients.filter((ingredient) => ingredient.unit !== 'spice');
        })
        console.log(data);
        setMealOption(data); // Update mealOption state with fetched data
      })
      .catch(error => {
        console.error('Error fetching meals:', error);
      });
  }, [day, mealCategory]);

  const caloriesHandler = () => {
    if (selectedMeal === null) return;
  
    const confirmedMeal = mealOption[selectedMeal];
  
    if (confirmedMeal !== null) {
      const updatedCalories = {
        ...calories,
        calories: calories.calories + confirmedMeal.calories,
        proteins: calories.proteins + confirmedMeal.proteins,
        carbs: calories.carbs + confirmedMeal.carbs,
        fats: calories.fats + confirmedMeal.fats,
      };
  
      setCalories(updatedCalories); // Assuming setCalories updates the context
    }
  };

  const decimalToFraction = (decimal: number): string => {
    if(decimal.toString().indexOf('.') > -1) {
    
    
    let numerator = decimal * 100;
      let denominator = 100;
      
      // Simplify fraction
      let gcd = function(a: number, b: number): number {
          return b ? gcd(b, a % b) : a;
      };
      let divisor = gcd(numerator, denominator);
      
      numerator /= divisor;
      denominator /= divisor;
      
      return numerator + '/' + denominator;
    }
    return decimal.toString();
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
                  {mealOption[selectedMeal].ingredients.map((ingredient, idx) => {
                    return (<li key={idx}>
                      <Typography className='leading-6'>{ingredient.pivot.quantity && decimalToFraction(ingredient.pivot.quantity)} {ingredient.unit && ingredient.unit} {ingredient.title}</Typography>
                    </li>)
                  })}
                  {mealOption[selectedMeal].spices.length > 0 && <Typography className='text-m font-semibold right-[1rem] relative mt-[1rem]'>DOCHUCOVADLÁ</Typography>}
                  {mealOption[selectedMeal].spices.map((ingredient, idx) => {
                    return (
                    <li key={idx}>
                      <Typography className='leading-6'>{ingredient.title}</Typography>
                    </li>)
                  })}
                </ul>
                {/* <Typography className='mt-[1rem]'>{mealOptions[selectedMeal].ingredient_recommendation}</Typography> */}
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography className='text-m font-semibold mb-[1rem]'>POSTUP</Typography>
                <Typography>{mealOption[selectedMeal].description}</Typography>
                <Box mt={6}>
                  <Typography className='text-m font-semibold mb-[1rem]'>KALORICKÉ HODNOTY</Typography>
                  <Typography>Kalórie = {mealOption[selectedMeal].calories}</Typography>
                  <Typography>Proteíny = {mealOption[selectedMeal].proteins}</Typography>
                  <Typography>Sacharidy = {mealOption[selectedMeal].carbs}</Typography>
                  <Typography>Tuky = {mealOption[selectedMeal].fats}</Typography>
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
