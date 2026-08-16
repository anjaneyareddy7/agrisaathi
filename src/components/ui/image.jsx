import React from 'react';

export function Image({ src, className, fittingType = 'fill', ...props }) {
  return (
    <img 
      src={src} 
      className={`${className} ${fittingType === 'fill' ? 'object-cover' : 'object-contain'}`}
      alt={props.alt || ''}
      {...props} 
    />
  );
}
