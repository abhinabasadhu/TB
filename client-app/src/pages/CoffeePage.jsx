import React, { useEffect, useState } from 'react';
import '../styles/Coffee.scss';
import { useNavigate } from 'react-router-dom';
import CoffeeTableComponent from '../components/specific/CoffeeTable';
import { fetchAllCoffee, fetchIngredientData } from '../api/apiClient';

const CoffeePage = () => {
    const [data, setData] = useState([]);
    const [ingredientsData, setIngredientsData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch ingredients
    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const result = await fetchAllCoffee();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchIngredientsData = async () => {
            try {
              const result = await fetchIngredientData();
              console.log(result);
              if (result) {
                setIngredientsData(result);
              } else {
                alert('Please create ingredients from menu that can be added to a coffee first');
              }
            } catch (err) {
              console.info(err)
            }
        }
        fetchIngredientsData();
        fetchApiData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="coffee-page">
            <CoffeeTableComponent data={data} />
        </div>
    );
};

export default CoffeePage;
