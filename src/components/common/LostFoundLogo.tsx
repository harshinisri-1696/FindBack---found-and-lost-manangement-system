import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const LostFoundLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <img 
      src="/logo.svg" 
      alt="FindBack Lost and Found Logo" 
      width={size} 
      height={size} 
      className={`${className} object-contain shrink-0`}
      referrerPolicy="no-referrer"
    />
  );
};
