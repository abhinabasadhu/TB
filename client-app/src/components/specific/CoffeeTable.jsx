import React, { useState } from 'react';
import Button from '../common/Button';
import Dialog from '../common/Dialog';
import Input from '../common/Input';
import { saveNewCoffee } from '../../api/apiClient';
import '../styles/CoffeeTable.scss';

const CoffeeTableComponent = ({ coffeeData, ingredientData }) => {
  const [openAddCoffeeDialog, setOpenAddCoffeeDialog] = useState(false);
  const [coffeeName, setCoffeeName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleCheckboxChange = (ingredientId) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientId)
        ? prevSelected.filter(id => id !== ingredientId)
        : [...prevSelected, ingredientId]
    );
  };

  const handleSaveCoffee = async () => {
    if (!coffeeName) {
      alert('Your coffee needs a name');
      return;
    }
    // saves new coffee
    try {
      const response = await saveNewCoffee(selectedIngredients, coffeeName);
      alert('Your coffee has been successfully created!');
      coffeeData.push(response);
    } catch (err) {
      alert(err)
    } finally {
      setOpenAddCoffeeDialog(false);
    }
  };

  console.log(coffeeData)

  return (
    <div className='coffee-table-container'>
      <h2>
        Coffees
        <Button onClick={() => setOpenAddCoffeeDialog(true)}>Add New Coffee</Button>
      </h2>
      <table className='coffee-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {coffeeData.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{(row.price.toFixed(2))}</td>
              <td>{Object.entries(row.characteristics).map(([key, value]) => (
                  <ul>
                    <li>
                      {key}: {value.amount} {value.unit}
                    </li>
                  </ul>
                ))}
              </td>
              <td><Button>Edit</Button></td>
              <td><Button>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog isOpen={openAddCoffeeDialog} onClose={() => setOpenAddCoffeeDialog(false)}>
        <h3>Add Coffee</h3>
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
        <div className="quantity-container">
          <label htmlFor="quantity">Name Your Coffee:</label>
          <Input
            id="Name"
            type="name"
            value={coffeeName}
            onChange={(e) => setCoffeeName(e.target.value)}
          />
        </div>
        <Button onClick={handleSaveCoffee}>Create Coffee</Button>
      </Dialog>
    </div>
  );
};

export default CoffeeTableComponent;
