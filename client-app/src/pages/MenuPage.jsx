import React, { useEffect, useState } from 'react';
import './../styles/Menu.scss';
import { fetchAllCoffee, fetchIngredientData, filterCoffee } from '../api/apiClient';
import Dialog from '../components/common/Dialog';
import CoffeeCard from '../components/specific/CoffeeCard';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

// Main Menu where user can choose coffee and add to basket
const MenuPage = () => {
  const nav = useNavigate();

  const [coffeeData, setCoffeeData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCoffee, setSelectedCoffee] = useState(null);

  const [itemsForCheckoutBasket, setItemsForCheckoutBasket] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customizedPrice, setCustomisedPrice] = useState(null);
  const [proceedToCheckout, setProceedToCheckout] = useState(false);

  // trigger to get all the coffees present in the db 
  useEffect(() => {
    const fecthApiData = async () => {
      try {
        const [ingredientData, coffeeData] = await Promise.all([fetchIngredientData(), fetchAllCoffee()]);
        setIngredientData(ingredientData);
        setCoffeeData(coffeeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fecthApiData();
  }, []);

  const handleCheckboxChange = (ingredientId) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientId)
        ? prevSelected.filter(id => id !== ingredientId)
        : [...prevSelected, ingredientId]
    );
  };

  // get the coffee by id adds the addons and moves it to checkout
  const handleSave = (id) => {
    const coffee = coffeeData.find(item => item._id === id);

    let ingredients = []

    for (const id of selectedIngredients) {
      const item = ingredientData.find(item => id === item._id);
      ingredients.push(item);
    }
    setDialogOpen(false);
    handleAddToCheckout(coffee, 1, selectedIngredients)
    return;
  }

  // opens up the customization dialog 
  const handleCustomize = (coffeeId) => {
    setSelectedCoffee(coffeeId);
    setDialogOpen(true);
  };

  // revise the price for extra items.
  useEffect(() => {
    let total = 0;
    for (const id of selectedIngredients) {
      let item = ingredientData.find(item => item._id === id);
      total = total + item.price
    }
    setCustomisedPrice(total.toFixed(2));
  }, [selectedIngredients.length])

  const handleAddToCheckout = (coffee, quantity, addOns = []) => {
    // Create a unique key for each item based on its customization
    const customizationString = JSON.stringify(addOns);

    // Note: we are creating an uniquekey there can be times customer wants orginal as well as customised version of the coffee
    const uniqueKey = `${coffee._id}_${customizationString}`;

    // Clone the coffee object and add the quantity, customization, unique key and customised price
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
        uniqueKey
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

  
  const handleFilterCoffees = async(key)  => {
    let filterKey;
    if (key === '0') {
      filterKey = 'default';
    } else if (key === '1') {
      filterKey = 'system';
    } else {
      filterKey = 'third_party';
    }
    try {
      const response = await filterCoffee(filterKey);
      setCoffeeData(response);
    } catch(e) {
      console.log(e);
    }   
  };


  // trigger to give customer option to continue shopping or exit to checkout
  useEffect(() => {
    if (proceedToCheckout) {
      if (window.confirm('Your Coffee has been saved in Checkout. Do you want to Checkout?')) {
        nav('/checkout', { state: { itemsForCheckoutBasket } });
      }
      // Reset flag
      setProceedToCheckout(false); 
    }
  }, [proceedToCheckout, nav, itemsForCheckoutBasket]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="menu-page">
      <select className="custom-select"  onChange={(e) => handleFilterCoffees(e.target.value)}>
        <option value={0}>Default</option>
        <option value={1}>System</option>
        <option value={2}>User</option>
      </select>
      <div className="card-container">
        {coffeeData.map(coffee => (
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
            <div key={item._id}>
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

export default MenuPage;
