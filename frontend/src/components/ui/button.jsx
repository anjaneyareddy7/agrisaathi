export const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-leaf-600 text-white shadow-sm hover:bg-leaf-700 hover:shadow-md',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:border-leaf-500 hover:text-leaf-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  const sizes = {
    default: 'px-4 py-2.5 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2.5',
  };

  const classes = `${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
