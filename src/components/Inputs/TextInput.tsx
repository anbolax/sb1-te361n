import React from 'react';

interface TextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    type?: 'text' | 'number';
}

export function TextInput({
                              label,
                              value,
                              onChange,
                              required = false,
                              placeholder,
                              type = 'text'
                          }: TextInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={required}
                placeholder={placeholder}
            />
        </div>
    );
}