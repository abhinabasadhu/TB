import React, { useState, useEffect } from 'react';
import '../styles/Checkout.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutTableComponent from '../components/specific/CheckoutTable';
import Button from '../components/common/Button';
import { placeOrder } from '../api/apiClient';
import Input from '../components/common/Input';

// Checkout Page
const CheckoutPage = () => {
  const nav = useNavigate();
  const location = useLocation();
  
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState('');

  // trigger to set the items 
  useEffect(() => {
    if (location.state && location.state.itemsForCheckoutBasket) {
      setItems(location.state.itemsForCheckoutBasket);
    }
  }, [location.state]);

  // for empty checkout 
  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h3>Your checkout is empty. Please visit the menu to select your coffee!</h3>
      </div>
    );
  }

  // api call to create the order
  const handleOrder = async () => {
    if (!customerName) {
      alert('Please Enter Customer Name');
      return;
    }
  
    try {
      await placeOrder({
        customerName: customerName,
        items: items
      });
      alert('Your order has been successfully created!');
      nav('/menu'); 
    } catch (err) {
      console.log(`Error placing order: ${err.message}`);
    }
  };

  return (
    <div className="checkout-page">
      <CheckoutTableComponent items={items} />
      <Input placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>
      <Button onClick={handleOrder}>Place Order</Button>
    </div>
  );
};

export default CheckoutPage;
