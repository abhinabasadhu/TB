import React, { useState } from 'react';
import Button from '../common/Button';
import Dialog from '../common/Dialog';
import Input from '../common/Input';
import { deleteCoffee, editCoffee, saveNewCoffee } from '../../api/apiClient';
import '../styles/CoffeeTable.scss';

const CoffeeTableComponent = ({ coffeeData, ingredientData }) => {
  const [openAddCoffeeDialog, setOpenAddCoffeeDialog] = useState(false);
  const [openEditCoffeeDialog, setOpenEditCoffeeDialog] = useState(false);

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [editCoffeeIngredients, setEditCoffeeIngredients] = useState([]);

  const [coffeeName, setCoffeeName] = useState('');
  const [cData, setCdata] = useState(coffeeData);
  const [editCoffeeId, setEditCoffeeId] = useState('');

  const [editCoffeeName, setEditCoffeeName] = useState('');

  const handleCheckboxChange = (ingredientId, isEditCoffee) => {
    if (isEditCoffee) {
      setEditCoffeeIngredients((prevSelected) =>
        prevSelected.includes(ingredientId)
          ? prevSelected.filter(id => id !== ingredientId)
          : [...prevSelected, ingredientId]
      );

    } else {
      setSelectedIngredients((prevSelected) =>
        prevSelected.includes(ingredientId)
          ? prevSelected.filter(id => id !== ingredientId)
          : [...prevSelected, ingredientId]
      );
    };
  };

  const handleSaveCoffee = async () => {
    // saves new coffee
    if (!coffeeName) {
      alert('Coffee needs a name');
      return;
    }
    try {
      const response = await saveNewCoffee(selectedIngredients, coffeeName, false);
      alert('Your coffee has been successfully created!');
      coffeeData.push(response);
    } catch (err) {
      console.log(err);
    } finally {
      setOpenAddCoffeeDialog(false);
      setSelectedIngredients([]);
      setCoffeeName('');
    }
  };

  const handleEditCoffeeDialog = (key) => {
    const coffee = coffeeData.find(item => item._id === key);

    setEditCoffeeName(coffee.name);
    setEditCoffeeIngredients(coffee.ingredients);
    setEditCoffeeId(coffee._id)
    setOpenEditCoffeeDialog(true);
  };


  const handleEditCoffee = async (id) => {
    try {
      const response = await editCoffee(id, editCoffeeIngredients, editCoffeeName);
      console.log(response);
      const newData = cData.filter((item) => item._id !== response._id);
      newData.push(response);
      setCdata(newData);
    } catch(e){
      console.log(e);
    } finally {
      setEditCoffeeIngredients([]);
      setEditCoffeeName('');
      setEditCoffeeId('');
      setOpenEditCoffeeDialog(false);
    }
  };

  const handleDeleteCoffee = async (key) => {
    if (window.confirm('Are you sure you want to delete this coffee ?')) {
      try {
        const response = await deleteCoffee(key);
        const newData = coffeeData.filter((item) => item._id !== response._id);
        setCdata(newData);
      } catch (e) {
        console.log(e);
      }
    }
  };

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
          {cData.map((row) => (
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
              <td><Button onClick={() => handleEditCoffeeDialog(row._id)}>Edit</Button></td>
              <td><Button onClick={() => handleDeleteCoffee(row._id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog isOpen={openAddCoffeeDialog} onClose={() => setOpenAddCoffeeDialog(false)}>
        <h3>Add Coffee</h3>
        {ingredientData.map(item => (
          <div key={item._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIngredients.includes(item._id)}
                onChange={() => handleCheckboxChange(item._id, false)}
              />
              {item.name} - {item.quantity.amount} {item.quantity.unit} (£{item.price})
            </label>
          </div>
        ))}
        <div>
          <label>Name Your Coffee:</label>
          <Input
            id="Name"
            type="name"
            value={coffeeName}
            onChange={(e) => setCoffeeName(e.target.value)}
          />
        </div>
        <Button onClick={handleSaveCoffee}>Create Coffee</Button>
      </Dialog>
      <Dialog isOpen={openEditCoffeeDialog} onClose={() => setOpenEditCoffeeDialog(false)}>
        <h3>Edit</h3>
        {ingredientData.map(item => (
          <div key={item._id}>
            <label>
              <input
                type="checkbox"
                checked={editCoffeeIngredients.includes(item._id)}
                onChange={() => handleCheckboxChange(item._id, true)}
              />
              {item.name} - {item.quantity.amount} {item.quantity.unit} (£{item.price})
            </label>
          </div>
        ))
        }
        <div>
          <Input type="text" placeholder="Name" value={editCoffeeName} onChange={(e) => setEditCoffeeName(e.target.value)} />
        </div>
        <Button onClick={() => handleEditCoffee(editCoffeeId)}>Save Changes</Button>
      </Dialog>
    </div>
  );
};

export default CoffeeTableComponent;
