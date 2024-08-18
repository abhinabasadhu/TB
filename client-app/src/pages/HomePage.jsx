import React, { useEffect, useState } from 'react';
import '../styles/Home.scss';
import { useNavigate } from 'react-router-dom';
import { fetchIngredientData, saveNewCoffee } from '../api/apiClient';
import Dialog from '../components/common/Dialog';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
const HomePage = () => {
  const nav = useNavigate();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]); // To store selected ingredients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coffeeName, setCoffeeName] = useState('');

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const result = await fetchIngredientData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  const handleCheckboxChange = (ingredientId) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientId)
        ? prevSelected.filter(id => id !== ingredientId)
        : [...prevSelected, ingredientId]
    );
  };

  const handleSave = async () => {
    if (!coffeeName) {
      alert('Your coffee needs a name');
      return;
    }
    // saves new coffee
    try {
      await saveNewCoffee(selectedIngredients, coffeeName, true);
      alert('Your coffee has been successfully created! You are now getting directed to the menu to select your coffee.')
      nav('/menu');
    } catch (err) {
      alert(err)
    } finally {
      setDialogOpen(false);
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home-page">
      <div className="card-container">
        <div className="card options" onClick={() => { nav('/menu') }}>
          <h1>Choose Your Coffee</h1>
        </div>
        <div className="card create-own" onClick={() => { setDialogOpen(true) }}>
          <h1>Create Your Own Coffee</h1>
        </div>
      </div>
      <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <h2>Create Your Own Coffee</h2>
        <p>Customize your coffee with various options.</p>
        {data.map(item => (
          <div key={item._id} className="ingredient-option">
            <label>
              <input
                type="checkbox"
                checked={selectedIngredients.includes(item._id)}
                onChange={() => handleCheckboxChange(item._id)}
              />
              {item.name} - {item.quantity.amount} {item.quantity.unit} (£{item.price})
            </label>
          </div>
        ))}
        <div className="quantity-container">
          <label htmlFor="quantity">Name Your Coffee:</label>
          <Input
            id="Name"
            type="name"
            value={coffeeName}
            onChange={(e) => setCoffeeName(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Create Coffee</Button>
      </Dialog>
    </div>
  );
};

export default HomePage;
