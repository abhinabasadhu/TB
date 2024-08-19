import React, { useState } from 'react';
import '../styles/Admin.scss';
import { useNavigate } from 'react-router-dom';

// Admin Page
const AdminPage = () => {
  alert('Since this is a demo application, separate authentication for admins has not been implemented.');
  const nav = useNavigate();
  return (
    <div className="admin-page">
      <div className="card-container">
        <div className="card options" onClick={() => { nav('/ingredient') }}>
          <h1>Add New Ingredient</h1>
        </div>
        <div className="card create-own" onClick={() => { nav('/coffee') }}>
          <h1>Create New Coffee</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
