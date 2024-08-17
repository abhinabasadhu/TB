import React, { useEffect, useState } from 'react';
import '../styles/CheckoutTable.scss';

const CheckoutTableComponent = ({ itemsForCheckoutBasket }) => {
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        let total = 0;
        for (const item of itemsForCheckoutBasket) {
            total = total + item.price;
            if (item.customizedPrice) {
                total = total + parseFloat(item.customizedPrice);
            }
        }
        setTotalAmount(parseFloat(total).toFixed(2));
    }, [itemsForCheckoutBasket]);

    return (
        <div className='checkout-table'>
            <h2>Checkout Basket</h2>
            <table>
                <thead>
                    <tr>
                        <th ingredientData>Name</th>
                        <th ingredientData>Characteristics</th>
                        <th ingredientData>AddOn</th>
                        <th ingredientData>Quantity</th>
                        <th ingredientData>Coffee Price</th>
                        <th ingredientData>AddOn Price</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsForCheckoutBasket.map((row) => (
                        <tr key={row.id}>
                            <td ingredientData>{row.name}</td>
                            <td ingredientData>{Object.entries(row.characteristics).map(([key, value]) => (
                                <li>
                                    {key}: {value.amount} {value.unit}
                                </li>
                            ))}</td>
                            <td ingredientData>{row.addOns.length > 0 ? 'Yes' : 'No'}</td>
                            <td ingredientData>{row.quantity}</td>
                            <td ingredientData>£{row.price}</td>
                            <td ingredientData>£{row.customizedPrice}</td>
                        </tr>
                    ))}
                    <tr>
                        <td ingredientData><strong>Total: £{totalAmount}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckoutTableComponent;
