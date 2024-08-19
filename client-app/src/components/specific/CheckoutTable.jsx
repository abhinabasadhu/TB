import React, { useEffect, useState } from 'react';
import '../styles/CheckoutTable.scss';

// component to display the checkout table with coffees
const CheckoutTableComponent = ({ items }) => {

    const [totalAmount, setTotalAmount] = useState(0);

    // triggered to display the total price 
    useEffect(() => {
        let total = 0;
        for (const item of items) {
            total = total + item.price;
            if (item.customizedPrice) {
                total = total + parseFloat(item.customizedPrice);
            }
        }
        setTotalAmount(parseFloat(total).toFixed(2));
    }, [items]);

    return (
        <div className='checkout-table-container'>
            <h2>Checkout Basket</h2>
            <table className='checkout-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Characteristics</th>
                        <th>AddOn</th>
                        <th>Quantity</th>
                        <th>Coffee Price</th>
                        <th>AddOn Price</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((row) => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{Object.entries(row.characteristics).map(([key, value]) => (
                                <li>
                                    {key}: {value.amount} {value.unit}
                                </li>
                            ))}</td>
                            <td>{row.addOns.length > 0 ? 'Yes' : 'No'}</td>
                            <td>{row.quantity}</td>
                            <td>£{row.price.toFixed(2)}</td>
                            <td>£{row.customizedPrice}</td>
                        </tr>
                    ))}
                    <tr>
                        <td><strong>Total: £{totalAmount}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckoutTableComponent;
