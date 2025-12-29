import React from 'react';
export const AccessibleButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  ariaLabel,
  className = '',
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Enhanced Form Input with proper labeling
export const AccessibleInput = ({ 
  label, 
  id, 
  error, 
  required = false, 
  type = 'text',
  ...props 
}) => {
  return (
    <div className="space-y-1">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
          }
          dark:bg-gray-800 dark:text-white
        `}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
