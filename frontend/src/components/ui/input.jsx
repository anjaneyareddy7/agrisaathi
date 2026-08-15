import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${className}`}
      {...props}
    />
  );
};
