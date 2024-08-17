import React, { useEffect, useState } from 'react';
import './../styles/Customer.scss';
import { fetchAllCoffee, fetchIngredientData } from '../api/apiClient';
import Dialog from '../components/common/Dailog';
import CoffeeCard from '../components/specific/CoffeeCard';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const CoffeeOptionspage = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [itemsForCheckoutBasket, setItemsForCheckoutBasket] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customizedPrice, setCustomisedPrice] = useState(null);
  const [proceedToCheckout, setProceedToCheckout] = useState(false);


  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const result = await fetchIngredientData();
        setIngredientData(result);
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

    let ingredients = []

    for (const id of selectedIngredients) {
      const item = ingredientData.find(item => id === item._id);
      ingredients.push(item);
    }
    setDialogOpen(false);
    handleAddToCheckout(coffee, 1, selectedIngredients)
    return;
  }

  const handleCustomize = (coffeeId) => {
    setSelectedCoffee(coffeeId);
    setDialogOpen(true);
  };

  useEffect(()=>{
    // revise the price for extra items.
    let total = 0;
    for (const id of selectedIngredients) {
        let item = ingredientData.find(item => item._id === id);
        total = total + item.price
    }
    setCustomisedPrice(total.toFixed(2));
  },[selectedIngredients.length])

  const handleAddToCheckout = (coffee, quantity, addOns=[]) => {
    // Create a unique key for each item based on its customization
    const customizationString = JSON.stringify(addOns);
    const uniqueKey = `${coffee._id}_${customizationString}`;

    // Clone the coffee object and add the quantity, customization, and unique key
    let coffeeItem;
    if (addOns.length > 0) {
      coffeeItem = {
        ...coffee,
        quantity,
        addOns,
        uniqueKey,
        customizedPrice
      };
    } else {
      coffeeItem = {
        ...coffee,
        quantity,
        addOns,
        uniqueKey,
      };
    }


    setItemsForCheckoutBasket((prevItems) => {
      // Check if an item with the same unique key already exists
      const exists = prevItems.some(item => item.uniqueKey === coffeeItem.uniqueKey);

      if (exists) {
        // If it exists, update the quantity of that specific item
        return prevItems.map(item =>
          item.uniqueKey === coffeeItem.uniqueKey
            ? { ...item, quantity: item.quantity + quantity } // Update the quantity
            : item
        );
      } else {
        // If it doesn't exist, add the new item to the basket
        return [...prevItems, coffeeItem];
      }
    });
    setProceedToCheckout(true);
  };

  useEffect(() => {
    if (proceedToCheckout) {
      if (window.confirm('Your Coffee has been saved in Checkout. Do you want to Checkout?')) {
        nav('/checkout', { state: { itemsForCheckoutBasket } });
      }
      setProceedToCheckout(false); // Reset flag
    }
  }, [proceedToCheckout, nav, itemsForCheckoutBasket]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="customer-page">
      <div className="card-container">
        {data.map(coffee => (
          <CoffeeCard
            key={coffee._id}
            coffee={coffee}
            onAddToCheckout={handleAddToCheckout}
            onCustomize={handleCustomize}
          />
        ))}
      </div>
      {selectedCoffee && (
        <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <h2>Customize Your Coffee</h2>
          <h2>Extra Amount : £{customizedPrice}</h2>
          {ingredientData.map(item => (
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
          <Button onClick={() => handleSave(selectedCoffee)}>Add Your Customized Coffee To Checkout</Button>
        </Dialog>
      )}
    </div>
  );
};

export default CoffeeOptionspage;
