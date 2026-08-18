
export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-green-100 text-green-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    destructive: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
};
