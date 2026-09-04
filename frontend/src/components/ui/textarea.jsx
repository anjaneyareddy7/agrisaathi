export const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100 ${className}`}
      {...props}
    />
  );
};
