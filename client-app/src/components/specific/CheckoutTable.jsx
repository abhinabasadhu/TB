import React from 'react';

const CheckoutTableComponent = () => {
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45 },
  ];

  return (
    <div>
      <h2>Sample Table</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Age</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckoutTableComponent;
