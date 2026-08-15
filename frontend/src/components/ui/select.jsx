import React, { createContext, useContext, useState } from 'react';

const SelectContext = createContext();

export const Select = ({ children, value, onValueChange, ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = '', ...props }) => {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between bg-white ${className}`}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <span className="ml-2 text-gray-400">▼</span>
    </button>
  );
};

export const SelectValue = ({ placeholder, ...props }) => {
  const { value } = useContext(SelectContext);
  return <span {...props}>{value || placeholder}</span>;
};

export const SelectContent = ({ children, ...props }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto" {...props}>
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value, ...props }) => {
  const { onValueChange, setOpen } = useContext(SelectContext);
  return (
    <div
      className="px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors text-sm"
      onClick={() => { onValueChange(value); setOpen(false); }}
      {...props}
    >
      {children}
    </div>
  );
};
