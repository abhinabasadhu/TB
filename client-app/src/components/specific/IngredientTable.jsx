import React, { useState } from 'react';
import '../styles/IngredientTable.scss';
import Button from '../common/Button';
import Dialog from '../common/Dialog';
import Input from '../common/Input';
import { deleteIngredient, editIngredient, saveIngredient } from '../../api/apiClient';

const IngredientTableComponent = ({ data }) => {

  const [ingredientData, setIngredientData] = useState(data);

  const [openAddIngredientDailog, setOpenAddIngredientDailog] = useState(false);
  const [openEditIngredientDailog, setOpenEditIngredientDailog] = useState(false);

  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [ingredientPrice, setIngredientPrice] = useState('');

  const [editIngredientName, setEditIngredientName] = useState('');
  const [editIngredientAmount, setEditIngredientAmount] = useState('');
  const [editIngredientUnit, setEditIngredientUnit] = useState('');
  const [editIngredientPrice, setEditIngredientPrice] = useState('');
  const [editIngredientId, setEditIngredientId] = useState('');


  const handleSaveIngredientData = async () => {
    // save ingredient to db
    if (!ingredientAmount || !ingredientName || !ingredientUnit || !ingredientPrice) {
      alert('Please Enter All The Fields');
      return;
    }
    const ingredientData = {
      name: ingredientName,
      quantity: {
        amount: ingredientAmount,
        unit: ingredientUnit
      },
      price: ingredientPrice
    }
    try {
      const response = await saveIngredient(ingredientData);
      data.push(response);
    } catch (e) {
      console.log(e)
    } finally {
      setOpenAddIngredientDailog(false);
      setIngredientName('');
      setIngredientAmount('');
      setIngredientUnit('');
      setIngredientPrice('');
    }
  };
  // edit
  const handleOpenEditDailog = (id) => {
    const ingredient = ingredientData.find(item => item._id === id);
    setEditIngredientName(ingredient.name);
    setEditIngredientAmount(ingredient.quantity.amount);
    setEditIngredientUnit(ingredient.quantity.unit);
    setEditIngredientPrice(ingredient.price);
    setEditIngredientId(ingredient._id);
    setOpenEditIngredientDailog(true);
  };
  const handleEditIngredient = async (id) => {
    debugger;
    if (!editIngredientName || !editIngredientAmount || !editIngredientUnit || !editIngredientPrice) {
      alert('Please Enter All The Fields');
      return;
    }
    const data = {
      name: editIngredientName,
      quantity: {
        amount: editIngredientAmount,
        unit: editIngredientUnit
      },
      price: editIngredientPrice
    }
    try {
      const response = await editIngredient(id, data);
      const newData = ingredientData.filter((item) => item._id !== response._id);
      newData.push(response);
      setIngredientData(newData);
    } catch (e) {
      console.log(e);
    } finally {
      setEditIngredientName('');
      setEditIngredientAmount('');
      setEditIngredientUnit('');
      setEditIngredientPrice('');
      setEditIngredientId('');
      setOpenEditIngredientDailog(false);
    };
  };

  //delete
  const handleDeleteIngredient = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient ?')) {
        try {
          const response = await deleteIngredient(id);
          const newData = data.filter((item) => item._id !== response._id);
          setIngredientData(newData);
        } catch (e) {
          console.log(e);
          alert(e.response.data.message);
        } finally {
          setOpenAddIngredientDailog(false);
        }
    }
  };

  return (
    <div className='ingredient-table-container'>
      <h2>Ingredients <Button onClick={() => setOpenAddIngredientDailog(true)}>Add New Ingredient</Button> </h2>
      <table className='ingredient-table'>
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
          {ingredientData.map((row) => (
            <tr key={row._id}>
              <td>{row.name}</td>
              <td>{row.price}</td>
              <td>
                {Object.entries(row.quantity).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}</td>
              <td><Button onClick={() => handleOpenEditDailog(row._id)}>Edit</Button></td>
              <td><Button onClick={() => handleDeleteIngredient(row._id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog isOpen={openAddIngredientDailog} onClose={() => setOpenAddIngredientDailog(false)}>
        <h2>Add New Ingredient</h2>
        <Input type="text" placeholder="Name" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} />
        <Input type="number" min={0} placeholder="Amount" value={ingredientAmount} onChange={(e) => setIngredientAmount(e.target.value)} />
        <Input type="text" placeholder="Unit To Measure" value={ingredientUnit} onChange={(e) => setIngredientUnit(e.target.value)} />
        <Input type="number" min={0} placeholder="Price" value={ingredientPrice} onChange={(e) => setIngredientPrice(e.target.value)} />
        <Button onClick={handleSaveIngredientData}>Save</Button>
      </Dialog>
      <Dialog isOpen={openEditIngredientDailog} onClose={() => setOpenEditIngredientDailog(false)}>
        <h2>Edit Ingredient</h2>
        <Input type="text" placeholder="Name" value={editIngredientName} onChange={(e) => setEditIngredientName(e.target.value)} />
        <Input type="number" min={0} placeholder="Amount" value={editIngredientAmount} onChange={(e) => setEditIngredientAmount(e.target.value)} />
        <Input type="text" placeholder="Unit To Measure" value={editIngredientUnit} onChange={(e) => setEditIngredientUnit(e.target.value)} />
        <Input type="number" min={0} placeholder="Price" value={editIngredientPrice} onChange={(e) => setEditIngredientPrice(e.target.value)} />
        <Button onClick={() => handleEditIngredient(editIngredientId)}>Save Changes</Button>
      </Dialog>
    </div>
  );
};

export default IngredientTableComponent;
