import React from 'react';
import Link from 'next/link';
import Spinner from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  disabled = false,
  className = '',
  fullWidth = false,
  href,
  type = 'button',
  onClick,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-500/25 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 hover:shadow-gray-400/25 text-gray-800 focus:ring-gray-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 hover:shadow-md text-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/25 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/25 text-white focus:ring-green-500',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || isLoading ? disabledClasses : ''}
    ${widthClass}
    ${className}
  `;

  const spinnerColor = variant === 'outline' || variant === 'ghost' ? 'gray' : 'white';
  const spinnerSize = size === 'lg' ? 'md' : 'sm';

  const content = (
    <>
      {isLoading && (
        <span className="mr-2">
          <Spinner size={spinnerSize} color={spinnerColor} />
        </span>
      )}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      {isLoading && loadingText ? loadingText : children}
      {icon && iconPosition === 'right' && !isLoading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  if (href && !disabled && !isLoading) {
    return (
      <Link href={href} className={classes.trim()}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes.trim()}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {content}
    </button>
  );
}