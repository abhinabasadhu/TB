import React, { useState } from 'react';
import '../styles/Checkout.scss';
import { useLocation } from 'react-router-dom';
import CheckoutTableComponent from '../components/specific/CheckoutTable';

const CheckoutPage = () => {
    const location = useLocation();
    const { itemsForCheckoutBasket } = location.state || {};
  return (
    <div className="checkout-page">
        <CheckoutTableComponent itemsForCheckoutBasket={itemsForCheckoutBasket}/>
    </div>
  );
};

export default CheckoutPage;