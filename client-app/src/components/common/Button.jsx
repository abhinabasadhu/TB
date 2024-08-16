import React from 'react';
import '../styles/Button.scss';

const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <button className="btn" type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
