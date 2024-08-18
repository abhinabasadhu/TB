import React, { useEffect, useState } from 'react';
import '../styles/Ingredient.scss';
import { useNavigate } from 'react-router-dom';
import { fetchIngredientData } from '../api/apiClient';
import IngredientTableComponent from '../components/specific/IngredientTable';

const IngredientPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch ingredients
    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const result = await fetchIngredientData();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApiData();
    }, [])


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="ingredient-page">
            <IngredientTableComponent data={data}/>
        </div>
    );
};

export default IngredientPage;
