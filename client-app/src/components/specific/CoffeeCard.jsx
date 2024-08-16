import React, { useEffect, useState } from 'react';
import Input from '../common/Input'; // Import your Input component
import Button from '../common/Button'; // Import your Button component
import '../styles/CoffeeCard.scss'; // Styling for the CoffeeCard component

const CoffeeCard = ({ coffee, customisedItems, onAddToCheckout, onCustomize }) => {
  const [quantity, setQuantity] = useState(1);
  const [customizedPrice, setCustomisedPrice] = useState(null);

  useEffect(()=>{
    // revise the price for extra items.
    let total = 0;
    for (const item of customisedItems) {
        total = total + item.price
    }
    setCustomisedPrice(total);
  },[customisedItems.length])


  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value)); // Convert input value to number
  };

  const handleAddToCheckout = () => {
    onAddToCheckout(coffee, quantity);
  };

  return (
    <div className="coffee-card">
      <h2>{coffee.name}</h2>
      <p>Price: £{(coffee.price + customizedPrice).toFixed(2)}</p>
      <p>Origin: {coffee.origin}</p>
      <div className="coffee-characteristics">
        <h3>Characteristics:</h3>
        <ul>
          {Object.entries(coffee.characteristics).map(([key, value]) => (
            <li>
              {key}: {value.amount} {value.unit}
            </li>
          ))}
          {customisedItems.length > 0 ?  
            customisedItems.map(item => (
                <li>
                  {item.name}: {item.quantity.amount} {item.quantity.unit}
                </li>
              ))
          : ''}
        </ul>
      </div>
      <div className="quantity-container">
        <label htmlFor={`quantity-${coffee._id}`}>Quantity:</label>
        <Input
          id={`quantity-${coffee._id}`}
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          step="1"
        />
      </div>
      <div className="button-group">
        <Button onClick={handleAddToCheckout}>Add to Checkout</Button>
        <Button onClick={() => onCustomize(coffee._id)}>Customize</Button>
      </div>
    </div>
  );
};

export default CoffeeCard;
