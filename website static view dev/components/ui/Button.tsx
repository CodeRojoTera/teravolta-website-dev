
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
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap";

  const variantClasses = {
    primary: "bg-[#004a90] text-white hover:bg-teravolta-blue-dark",
    secondary: "bg-[#c3d021] text-[#194271] hover:bg-teravolta-lime-dark",
    outline: "border-2 border-[#004a90] text-[#004a90] bg-transparent hover:bg-teravolta-blue hover:text-white"
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

  if (href) {
    return (
      <Link href={href} className={classes} style={buttonStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} style={buttonStyle} {...props}>
      {children}
    </button>
  );
}