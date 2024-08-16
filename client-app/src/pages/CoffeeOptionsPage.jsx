import React, { useEffect, useState } from 'react';
import './../styles/Customer.scss';
import { fetchAllCoffee, fetchIngredientData } from '../api/apiClient';
import Dialog from '../components/common/Dailog';
import CoffeeCard from '../components/specific/CoffeeCard';
import Button from '../components/common/Button';

const CoffeeOptionspage = () => {
  const [data, setData] = useState([]);
  const [addOnData, setAddOnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customisedItems,  setCustomisedItems] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const result = await fetchIngredientData();
        setAddOnData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCoffeeDataFromApi = async () => {
      try {
        const result = await fetchAllCoffee();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
    fetchCoffeeDataFromApi();
  }, []);
  
  const handleCheckboxChange = (ingredientId) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientId)
        ? prevSelected.filter(id => id !== ingredientId)
        : [...prevSelected, ingredientId]
    );
  };

  const handleSave = (id) => {
    const coffee = data.find(item => item._id === id);
    coffee.addOns = selectedIngredients;
    
    let ingredients  = []

    for (const id of selectedIngredients) {
      const item = addOnData.find(item => id === item._id);
      ingredients.push(item);
    }
    setCustomisedItems(ingredients);
    setDialogOpen(false);
    return
  }

  const handleCustomize = (coffeeId) => {
    setSelectedCoffee(coffeeId);
    setDialogOpen(true);
  };

  const handleAddToCheckout = (coffeeId, quantity) => {
    console.log('Added to checkout:', { coffeeId, quantity });
    // Add logic to handle adding to checkout
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="customer-page">
      <div className="card-container">
        {data.map(coffee => (
          <CoffeeCard
            key={coffee._id}
            coffee={coffee}
            customisedItems={customisedItems}
            onAddToCheckout={handleAddToCheckout}
            onCustomize={handleCustomize}
          />
        ))}
      </div>
      {selectedCoffee && (
        <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <h2>Customize Your Coffee</h2>
          {addOnData.map(item => (
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
          <Button onClick={() => handleSave(selectedCoffee)}>Add Items</Button>       
        </Dialog>
      )}
    </div>
  );
};

export default CoffeeOptionspage;
