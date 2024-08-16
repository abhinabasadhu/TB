import React, { useState } from 'react';
import '../styles/Admin.scss';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const nav = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="admin-page">
      <div className="card-container">
        <div className="card options" onClick={() => { nav('/menu') }}>
          <h1>Add New Ingredient</h1>
        </div>
        <div className="card create-own" onClick={() => { setDialogOpen(true) }}>
          <h1>Create New Coffee</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
