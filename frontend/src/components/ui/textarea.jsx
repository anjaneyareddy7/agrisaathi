import React from 'react';

export const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none transition ${className}`}
      {...props}
    />
  );
};
