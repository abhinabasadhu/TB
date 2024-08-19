// all api calls to the db

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// get all the ingredients
export const fetchIngredientData = async () => {
  try {
    const response = await apiClient.get('/ingredient/');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// create new coffee
export const saveNewCoffee = async (selectedIngredients, coffeeName, ori) => {
  try {
    const response = await apiClient.post('/product/', {
      ingredients: selectedIngredients,
      name: coffeeName,
      origin: ori ? 'third_party' : 'system'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

// get all coffees
export const fetchAllCoffee = async () => {
  try {
    const response = await apiClient.get('/product/');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// create order
export const placeOrder = async (data) => {
  try {
    const response = await apiClient.post('/order/', data );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// save ingredient
export const saveIngredient = async(data) => {
  try {
    const response = await apiClient.post('/ingredient/',  data );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// edit ingredient
export const editIngredient = async(id, data) => {
  try {
    const response = await apiClient.post(`/ingredient/${id}`, data );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// delete ingredient
export const deleteIngredient = async(id) => {
  try {
    const response = await apiClient.delete(`/ingredient/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// delete coffee
export const deleteCoffee = async(id) => {
  try {
    const response = await apiClient.delete(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// edit coffee
export const editCoffee = async(id, editCoffeeIngredients, editCoffeeName) => {
  try {
    const response = await apiClient.post(`/product/${id}`, { 
      name: editCoffeeName,
      ingredients: editCoffeeIngredients
     });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}