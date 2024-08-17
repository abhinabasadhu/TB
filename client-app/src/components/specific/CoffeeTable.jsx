import React, { useEffect, useState } from 'react';
import Button from '../common/Button';

const CoffeeTableComponent = ({ data }) => {
  const [coffeeData, setCoffeeData] = useState(data || []);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');


  console.log(coffeeData);
  // name: string;
  // characteristics: object;
  // origin: Origin;
  // ingredients: IIngredient[];
  // price: number;
  // addOns: Types.ObjectId[];
  const handleAddCoffee = async () => {

  };


  return (
    <div className='coffee-table-container'>
      <h2>Coffees <Button onClick={() => handleAddCoffee}>Add New Coffee</Button></h2>
      <table className='coffee-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {coffeeData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoffeeTableComponent;
