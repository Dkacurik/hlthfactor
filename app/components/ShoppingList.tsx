import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from '@mui/material'
import { Context } from '../context'
import { Ingredient, Meal } from '../types'
import PrimaryButton from './PrimaryButton'

interface ConfirmedMeal {
  meal: Meal
}

interface ShoppingListItem {
  id: string // Use string as ID to uniquely identify ingredients and spices
  text: string
  completed: boolean
  quantity: number
  unit?: string
}

const ShoppingList = () => {
  const [ingredientsList, setIngredientsList] = useState<ShoppingListItem[]>([])
  const [spices, setSpicesList] = useState<ShoppingListItem[]>([])

  const context = React.useContext(Context)

  if (!context) {
    throw new Error('ShoppingList must be used within a Context.Provider')
  }

  const { confirmedMeals } = context

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

  const formatOutput = (text: string): string => {
    const splitText = text.split(' ')
    const quantity = splitText[0]
    const hasDecimal = quantity.includes('.')
    const fraction = hasDecimal
      ? decimalToFraction(parseFloat(`0.${quantity.split('.')[1]}`))
      : ''
    const unit = splitText[1]
    const ingredient = splitText.slice(2).join(' ')
    return `${
      parseInt(quantity.split('.')[0]) > 0 ? `${quantity.split('.')[0]}` : ''
    }
    ${
      fraction !== ''
        ? parseInt(quantity.split('.')[0]) > 0
          ? ` a ${fraction}`
          : `${fraction}`
        : ''
    } ${unit} ${ingredient}`
  }

  useEffect(() => {
    const countIngredientsAndSpices = (
      meals: ConfirmedMeal[]
    ): { ingredients: ShoppingListItem[]; spices: ShoppingListItem[] } => {
      const countedItems = {
        ingredients: [] as ShoppingListItem[],
        spices: [] as ShoppingListItem[],
      }

      meals.forEach((confirmedMeal) => {
        // Count ingredients
        confirmedMeal.meal.ingredients.forEach((ingredient: Ingredient) => {
          const { id, title, pivot } = ingredient
          const ingredientKey = `${id}-${title}` // Unique key based on id and title
          const existingIndex = countedItems.ingredients.findIndex(
            (item) => item.id === ingredientKey
          )
          if (existingIndex !== -1) {
            countedItems.ingredients[existingIndex].text = `${
              countedItems.ingredients[existingIndex].quantity + pivot.quantity
            } ${countedItems.ingredients[existingIndex].unit} - ${title}`
          } else {
            countedItems.ingredients.push({
              id: ingredientKey,
              text: `${pivot.quantity} ${ingredient.unit} - ${title}`,
              completed: false,
              quantity: pivot.quantity,
              unit: ingredient.unit,
            })
          }
        })

        // Count spices
        confirmedMeal.meal.spices.forEach((spice: Ingredient) => {
          const { id, title, pivot } = spice
          const spiceKey = `${id}-${title}` // Unique key based on id and title
          const existingIndex = countedItems.spices.findIndex(
            (item) => item.id === spiceKey
          )
          if (existingIndex !== -1) {
            countedItems.spices[existingIndex].text = `${title}`
          } else {
            countedItems.spices.push({
              id: spiceKey,
              text: title,
              completed: false,
              quantity: pivot.quantity,
            })
          }
        })
      })

      return countedItems
    }

    const { meals } = confirmedMeals
    const countedItems = countIngredientsAndSpices(meals)

    // Format items for shopping list
    const ingredientsListItems: ShoppingListItem[] = [
      ...countedItems.ingredients.map((item) => ({
        ...item,
        text: `${item.text}`,
      })),
    ]
    const spicesListItems: ShoppingListItem[] = [
      ...countedItems.spices.map((item) => ({ ...item, text: `${item.text}` })),
    ]
    setIngredientsList(ingredientsListItems)
    setSpicesList(spicesListItems)

    // Normally, you would return cleanup logic if necessary
    return () => {
      // Cleanup logic here if any
    }
  }, [confirmedMeals])

  const handleToggle = (id: string) => () => {
    setIngredientsList(
      ingredientsList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
    setSpicesList(
      spices.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const downloadPDF = () => {
    console.log(ingredientsList, spices)

    // Define the URL and the data to be sent
    const url = 'https://hlth.rsekonomik.sk/api/createpdf'
    const filteredIngredients = ingredientsList.filter(
      (ingredient) => !ingredient.completed
    )
    const filteredSpices = spices.filter((spice) => !spice.completed)
    const data = {
      ingredients: filteredIngredients,
      spices: filteredSpices,
    }

    // Create the POST request using fetch
    fetch(url, {
      method: 'POST', // Specify the request method
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(data), // Convert the data to a JSON string
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a blob URL representing the PDF data
        const url = URL.createObjectURL(blob)

        // Open the PDF in a new tab or window
        window.open(url)

        // Optionally, release the object URL after some time
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      })
      .catch((error) => console.error('Error fetching PDF:', error))
  }

  return (
    <div className="w-100">
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            marginBottom: '16px',
            marginTop: '2.5rem',
            fontSize: '1.5rem',
          }}
        >
          Váš nákupný zoznam
        </Typography>
        <Paper sx={{ padding: '16px', borderRadius: '3xl' }}>
          {ingredientsList.length > 0 ? (
            <>
              <Typography className="text-m font-semibold">
                INGREDIENCIE
              </Typography>
              <List>
                <Grid container spacing={2}>
                  {ingredientsList.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <ListItem disablePadding className="shadow-sm">
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
                          primary={`${formatOutput(item.text)}`}
                          onClick={handleToggle(item.id)}
                          sx={{
                            textDecoration: item.completed
                              ? 'line-through'
                              : 'none',
                            color: item.completed
                              ? 'rgba(0, 0, 0, 0.54)'
                              : 'rgba(0, 0, 0, 0.87)',
                          }}
                          className="text-md cursor-pointer"
                        />
                      </ListItem>
                    </Grid>
                  ))}
                </Grid>
              </List>
              {spices.length > 0 && (
                <>
                  <Typography className="text-m font-semibold mt-5">
                    DOCHUCOVADLÁ
                  </Typography>
                  <List>
                    <Grid container spacing={2}>
                      {spices.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <ListItem disablePadding className="shadow-sm">
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
                                textDecoration: item.completed
                                  ? 'line-through'
                                  : 'none',
                                color: item.completed
                                  ? 'rgba(0, 0, 0, 0.54)'
                                  : 'rgba(0, 0, 0, 0.87)',
                              }}
                              className="text-md cursor-pointer"
                            />
                          </ListItem>
                        </Grid>
                      ))}
                    </Grid>
                  </List>
                </>
              )}
            </>
          ) : (
            <Typography className="text-m">
              Nemáte žiadne položky v nákupnom zozname
            </Typography>
          )}
        </Paper>
      </Box>
      <Box my={4} textAlign="center">
        <PrimaryButton
          type="lg"
          title="ULOŽIŤ A STIAHNUŤ NÁKUPNÝ ZOZNAM "
          handleSave={downloadPDF}
        />
      </Box>
    </div>
  )
}

export default ShoppingList
