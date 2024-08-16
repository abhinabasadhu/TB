import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchIngredientData = async () => {
  try {
    const response = await apiClient.get('/ingredient/');
    return response.data; 
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const saveNewCoffee = async (selectedIngredients, coffeeName) => {
    try {
      const response = await apiClient.post('/product/', {
        ingredients: selectedIngredients,
        name: coffeeName,
        origin: 'third_party'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
};

export const fetchAllCoffee = async() => {
    try {
        const response = await apiClient.get('/product/');
        return response.data; 
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
}
