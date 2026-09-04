export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-leaf-100 text-leaf-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    destructive: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-700',
    outline: 'border border-gray-200 bg-transparent text-gray-600',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
};
