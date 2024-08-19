import React, { useEffect, useState } from 'react';
import '../styles/Coffee.scss';
import CoffeeTableComponent from '../components/specific/CoffeeTable';
import { fetchAllCoffee, fetchIngredientData } from '../api/apiClient';

// Admin Coffee Page
const CoffeePage = () => {
    const [data, setData] = useState(null);
    const [ingredientsData, setIngredientsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // trigger to fecth the coffe data and ingredient data to pass it the table component
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coffeeResult, ingredientsResult] = await Promise.all([fetchAllCoffee(), fetchIngredientData()]);
                setData(coffeeResult);
                setIngredientsData(ingredientsResult);

                if (!ingredientsResult || ingredientsResult.length === 0) {
                    alert('Please create ingredients from menu that can be added to a coffee first');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);  // Stop loading once data is fetched
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="coffee-page">
            {data && ingredientsData ? (
                <CoffeeTableComponent coffeeData={data} ingredientData={ingredientsData} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default CoffeePage;
