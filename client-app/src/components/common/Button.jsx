import React from 'react';
import '../styles/Button.scss';

const Button = ({ children, onClick, type = 'button' }) => {
  // generic button component
  return (
    <button className="btn" type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
