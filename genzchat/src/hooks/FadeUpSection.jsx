import React from 'react';
import { useFadeUp } from './useFadeUp';

export default function FadeUpSection({ children, className = '' }) {
  const [ref, visible] = useFadeUp();

  return (
    <div
      ref={ref}
      className={`
        opacity-0 transform translate-y-5 transition-all duration-500 ease-out
        ${visible ? 'animate-fadeUp opacity-100 translate-y-0' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
