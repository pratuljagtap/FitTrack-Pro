import React from 'react';

// Card Components
export const Card = ({ className = '', children, ...props }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Button Component
export const Button = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  disabled,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 bg-gray-900 text-white hover:bg-gray-800',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-accent hover:text-accent-foreground hover:bg-gray-100',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-100 text-gray-900 hover:bg-gray-200'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);

// Badge Component
export const Badge = ({ className = '', children, ...props }) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 bg-gray-900 text-white ${className}`} {...props}>
    {children}
  </div>
);

// Progress Component
export const Progress = ({ value = 0, className = '', ...props }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-gray-200 ${className}`} {...props}>
    <div 
      className="h-full w-full flex-1 bg-primary transition-all bg-blue-600"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
);