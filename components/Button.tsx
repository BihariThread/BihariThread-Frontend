'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'accent' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer select-none';

    const variants = {
        primary: 'bg-black text-white hover:bg-grey-600 active:bg-grey-500',
        accent: 'bg-terracotta text-white hover:brightness-110 active:brightness-90',
        outline: 'border-2 border-black text-black hover:bg-black hover:text-white',
        ghost: 'text-black hover:bg-black/5',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''
                } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
