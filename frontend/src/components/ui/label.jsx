export const Label = ({ children, className = '', ...props }) => (
  <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 ${className}`} {...props}>
    {children}
  </label>
);
