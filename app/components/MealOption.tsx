import React, { useState, useEffect, useContext } from 'react'
import { Grid, Paper, Box, Typography, Radio } from '@mui/material'
import PrimaryButton from './PrimaryButton'
import { Context } from '../context'
import { GroupedIngredients, Ingredient, Meal, MealCategory } from '../types'

interface MealOptionProps {
  day: string
  mealCategory: MealCategory
  expanded: string | false
}

const MealOption: React.FC<MealOptionProps> = ({
  day,
  mealCategory,
  expanded,
}) => {
  const [selectedMeal, setSelectedMeal] = useState<number | null>(0) // Track selected meal index
  const [mealOption, setMealOption] = useState<Meal[]>([]) // State for meals fetched from API
  const context = useContext(Context)

  if (!context) {
    throw new Error('MealSelector must be used within a Context.Provider')
  }

  const { calories, setCalories, confirmedMeals, setConfirmedMeals } = context

  useEffect(() => {
    fetch(`https://hlth.rsekonomik.sk/api/meals/${day}/${mealCategory}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is an array of Meal objects
        data.forEach((meal: Meal) => {
          meal.spices = meal.ingredients.filter(
            (ingredient: Ingredient) => ingredient.unit === 'spice'
          )
          meal.ingredients = meal.ingredients.filter(
            (ingredient) => ingredient.unit !== 'spice'
          )

          // Group ingredients by category
          const groupedIngredients: GroupedIngredients =
            meal.ingredients.reduce(
              (acc: GroupedIngredients, ingredient: Ingredient) => {
                const category = ingredient.pivot.category || ''
                if (!acc[category]) {
                  acc[category] = []
                }
                acc[category].push(ingredient)
                return acc
              },
              {}
            )

          // Group spices by category
          const groupedSpices: GroupedIngredients = meal.spices.reduce(
            (acc: GroupedIngredients, spice: Ingredient) => {
              const category = spice.pivot.category || ''
              if (!acc[category]) {
                acc[category] = []
              }
              acc[category].push(spice)
              return acc
            },
            {}
          )

          meal.groupedIngredients = groupedIngredients
          meal.groupedSpices = groupedSpices
        })

        setMealOption((prev) => {
          const oldConfirmedMeal = confirmedMeals.meals.find(
            (meal) => meal.day === day && meal.mealCategory === mealCategory
          )
          if (oldConfirmedMeal !== undefined) {
            setSelectedMeal(
              data.findIndex(
                (meal: Meal) => meal.title === oldConfirmedMeal.meal.title
              )
            )
          }
          return [...data]
        }) // Update mealOption state with fetched data
      })
      .catch((error) => {
        console.error('Error fetching meals:', error)
      })
  }, [day, mealCategory])

  const caloriesHandler = () => {
    if (selectedMeal === null) return

    const confirmedMeal = mealOption[selectedMeal]
    const oldConfirmedMeal = confirmedMeals.meals.find(
      (meal) => meal.day === day && meal.mealCategory === mealCategory
    )

    // Initialize updatedCalories with the current calories
    let updatedCalories = { ...calories }

    // Subtract old meal's nutritional values if it exists
    if (oldConfirmedMeal !== undefined) {
      updatedCalories = {
        ...updatedCalories,
        calories: updatedCalories.calories - oldConfirmedMeal.meal.calories,
        proteins: updatedCalories.proteins - oldConfirmedMeal.meal.proteins,
        carbs: updatedCalories.carbs - oldConfirmedMeal.meal.carbs,
        fats: updatedCalories.fats - oldConfirmedMeal.meal.fats,
      }

      // Remove the old meal from confirmedMeals
      setConfirmedMeals((prev) => ({
        ...prev,
        meals: prev.meals.filter(
          (meal) => !(meal.day === day && meal.mealCategory === mealCategory)
        ),
      }))
    }

    // Add new meal's nutritional values if a new meal is selected
    if (confirmedMeal !== null) {
      updatedCalories = {
        ...updatedCalories,
        calories: updatedCalories.calories + confirmedMeal.calories,
        proteins: updatedCalories.proteins + confirmedMeal.proteins,
        carbs: updatedCalories.carbs + confirmedMeal.carbs,
        fats: updatedCalories.fats + confirmedMeal.fats,
      }

      // Add the new meal to confirmedMeals
      setConfirmedMeals((prev) => ({
        ...prev,
        meals: [...prev.meals, { meal: confirmedMeal, day, mealCategory }],
      }))
    }

    // Update calories state
    setCalories((prev) => ({ ...prev, ...updatedCalories }))
  }

  const decimalToFraction = (decimal: number): string => {
    if (decimal.toString().indexOf('.') > -1) {
      let numerator = decimal * 100
      let denominator = 100

      // Simplify fraction
      let gcd = function (a: number, b: number): number {
        return b ? gcd(b, a % b) : a
      }
      let divisor = gcd(numerator, denominator)

      numerator /= divisor
      denominator /= divisor

      return numerator + '/' + denominator
    }
    return decimal.toString()
  }

  return (
    <div className="m-[1.5rem]">
      <Box>
        <Grid container spacing={2}>
          {mealOption.map((meal: Meal, index) => (
            <Grid item xs={12} sm={4} key={meal.title}>
              <Paper
                sx={{
                  p: 2,
                }}
                className={`cursor-pointer rounded-3xl ${
                  selectedMeal === index
                    ? 'bg-secondary text-white'
                    : 'bg-white text-black'
                }`}
                onClick={() => setSelectedMeal(index)}
              >
                <Box display="flex" alignItems="center">
                  <Radio
                    checked={selectedMeal === index}
                    onChange={() => setSelectedMeal(index)}
                    color="default"
                    className={
                      selectedMeal === index ? 'text-primary' : 'text-secondary'
                    }
                    name="meal-options"
                  />
                  <Box ml={1}>
                    <Typography
                      className={`text-[1.250rem] font-semibold ${
                        selectedMeal === index ? 'text-primary' : 'text-black'
                      }`}
                    >
                      {meal.title}
                    </Typography>
                    <Typography className="text-m">
                      {meal.time_of_preparation}
                    </Typography>
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
                <ul className="list-disc pl-[1rem]">
                  {mealOption[selectedMeal] &&
                    mealOption[selectedMeal].groupedIngredients &&
                    Object.keys(
                      mealOption[selectedMeal].groupedIngredients
                    ).map((category, idx) => (
                      <React.Fragment key={idx}>
                        {category && category.length > 0 && (
                          <Typography className="text-m font-semibold right-[1rem] relative mt-[1rem]">
                            {category.toLocaleUpperCase()}
                          </Typography>
                        )}

                        {/* Render ingredients */}
                        {mealOption[selectedMeal].groupedIngredients && (
                          <Typography className="text-s font-semibold right-[1rem] relative mt-[1rem]">
                            INGREDIENCIE
                          </Typography>
                        )}
                        {mealOption[selectedMeal].groupedIngredients &&
                          mealOption[selectedMeal].groupedIngredients[
                            category
                          ]?.map((ingredient, idx) => (
                            <li key={idx}>
                              <Typography className="leading-6">
                                {ingredient.pivot.quantity &&
                                  decimalToFraction(
                                    ingredient.pivot.quantity
                                  )}{' '}
                                {ingredient.unit && ingredient.unit}{' '}
                                {ingredient.title}
                              </Typography>
                            </li>
                          ))}
                        {/* Render spices */}
                        {mealOption[selectedMeal].groupedSpices &&
                          mealOption[selectedMeal].groupedSpices[category]
                            ?.length > 0 && (
                            <Typography className="text-s font-semibold right-[1rem] relative mt-[1rem]">
                              DOCHUCOVADLÁ
                            </Typography>
                          )}
                        {mealOption[selectedMeal].groupedSpices &&
                          mealOption[selectedMeal].groupedSpices[category]
                            ?.length > 0 &&
                          mealOption[selectedMeal].groupedSpices[category].map(
                            (spice, idx) => (
                              <li key={idx}>
                                <Typography className="leading-6">
                                  {spice.title}
                                </Typography>
                              </li>
                            )
                          )}
                      </React.Fragment>
                    ))}
                </ul>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography className="text-m font-semibold mb-[1rem]">
                  POSTUP
                </Typography>
                <Typography>{mealOption[selectedMeal].description}</Typography>
                <Box mt={6}>
                  <Typography className="text-m font-semibold mb-[1rem]">
                    KALORICKÉ HODNOTY
                  </Typography>
                  <Typography>
                    Kalórie = {mealOption[selectedMeal].calories}
                  </Typography>
                  <Typography>
                    Proteíny = {mealOption[selectedMeal].proteins}
                  </Typography>
                  <Typography>
                    Sacharidy = {mealOption[selectedMeal].carbs}
                  </Typography>
                  <Typography>
                    Tuky = {mealOption[selectedMeal].fats}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        <Box mt={4} textAlign="center">
          <PrimaryButton
            type="md"
            title="Potvrdiť"
            handleSave={caloriesHandler}
          />
        </Box>
      </Box>
    </div>
  )
}

export default MealOption
