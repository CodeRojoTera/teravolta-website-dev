
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps & { isLoading?: boolean }) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap relative";

  const variantClasses = {
    primary: "bg-teravolta-blue text-white hover:bg-teravolta-blue-dark disabled:bg-gray-300 disabled:cursor-not-allowed",
    secondary: "bg-teravolta-lime text-teravolta-navy hover:bg-teravolta-lime-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
    outline: "border-2 border-teravolta-blue text-teravolta-blue bg-transparent hover:bg-teravolta-blue hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonStyle = {
    fontFamily: 'Gilroy, -apple-system, BlinkMacSystemFont, sans-serif'
  };

  if (href && !isLoading && !disabled) {
    return (
      <Link href={href} className={classes} style={buttonStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      style={buttonStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}