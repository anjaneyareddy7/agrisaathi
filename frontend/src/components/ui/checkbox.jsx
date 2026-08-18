
export function Checkbox({ checked, onCheckedChange, className = '', id, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      className={`h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 ${className}`}
      {...props}
    />
  );
}
