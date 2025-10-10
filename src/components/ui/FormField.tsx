import React from 'react';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'password' | 'select' | 'textarea' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  step?: string;
  min?: string;
  max?: string;
  rows?: number;
}

interface FormFieldProps {
  config: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  config,
  value,
  onChange,
  error
}) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const errorClasses = error ? "border-red-300 focus:ring-red-500" : "border-gray-300";

  const renderInput = () => {
    switch (config.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={config.required}
            className={`${baseClasses} ${errorClasses}`}
          >
            <option value="">Seleccionar...</option>
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={config.required}
            placeholder={config.placeholder}
            rows={config.rows || 3}
            className={`${baseClasses} ${errorClasses} resize-none`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={config.required}
            placeholder={config.placeholder}
            step={config.step}
            min={config.min}
            max={config.max}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      default:
        return (
          <input
            type={config.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={config.required}
            placeholder={config.placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};