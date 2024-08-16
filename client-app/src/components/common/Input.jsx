import React from 'react';
import '../styles/Input.scss';

const Input = ({ type = 'text', value, onChange, placeholder, id, min, max, step, className, ...props }) => {
  return (
    <div className={`input-container ${className}`}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="input-field"
        {...props}
      />
    </div>
  );
};

export default Input;
