import { ConfirmedMeals, ShoppingListItem } from "./types";

const downloadPDF = async (ingredientsList: ShoppingListItem[], spices: ShoppingListItem[]) => {
    const url = 'https://api.hlthfactor.com/api/createpdf';
    const filteredIngredients = ingredientsList.filter((ingredient) => !ingredient.completed);
    const filteredSpices = spices.filter((spice) => !spice.completed);
    const data = {
      ingredients: filteredIngredients,
      spices: filteredSpices,
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl);
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      } else {
        console.error('Error fetching PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };
  
const storeConfirmedMeals = async (confirmedMeals: ConfirmedMeals) => {
    const storeURL = 'https://api.hlthfactor.com/api/confirmed-meals';
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const body = {
      confirmed_meals: confirmedMeals,
      token: token,
    };
  
    if (!token) {
      console.log('Token not found');
      return;
    }
  
    try {
      const response = await fetch(storeURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (response.status === 200) {
        console.log('Saved');
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error storing confirmed meals:', error);
    }
  };

  const getSavedMeals = async (token: string): Promise<ConfirmedMeals> => {
      try {
          const response = await fetch(`https://api.hlthfactor.com/api/confirmed-meals/${token}`);
          const data = await response.json();
          return JSON.parse(data.confirmed_meals) as ConfirmedMeals;
      } catch (error) {
          throw new Error('Error fetching saved meals');
      }
  }

export {downloadPDF, storeConfirmedMeals, getSavedMeals}