import React from 'react';

export function Image({ src, alt = '', className = '', fallback = null, ...props }) {
  const [error, setError] = React.useState(false);
  if (error && fallback) return fallback;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
