'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export default function Input({
    label,
    error,
    icon,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-heading font-semibold tracking-wider uppercase text-grey-600 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full px-4 py-3 bg-white border-2 border-grey-200 rounded-xl font-body text-black placeholder:text-grey-400 
            focus:border-terracotta focus:outline-none transition-colors duration-200
            ${icon ? 'pl-10' : ''} 
            ${error ? 'border-red-500' : ''} 
            ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500 font-body">{error}</p>
            )}
        </div>
    );
}
