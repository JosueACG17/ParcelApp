import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { FormField } from './FormField';
import type { FormFieldConfig } from './FormField';

interface DynamicFormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  title: string;
  fields: FormFieldConfig[];
  initialData?: Partial<T>;
  columns?: 1 | 2;
  submitButtonText?: string;
  submitButtonColor?: 'blue' | 'green' | 'red' | 'purple';
}

export function DynamicFormModal<T extends Record<string, unknown>>({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData,
  columns = 2,
  submitButtonText = 'Guardar',
  submitButtonColor = 'blue'
}: DynamicFormModalProps<T>) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar datos del formulario
  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      
      fields.forEach(field => {
        if (initialData && initialData[field.name as keyof T] !== undefined) {
          const value = initialData[field.name as keyof T];
          initialValues[field.name] = typeof value === 'string' ? value : String(value);
        } else {
          initialValues[field.name] = '';
        }
      });
      
      setFormData(initialValues);
      setErrors({});
    }
  }, [isOpen, initialData, fields]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} es obligatorio`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convertir datos del formulario al tipo correcto
    const processedData: Record<string, unknown> = { ...initialData };
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.type === 'number') {
        processedData[field.name] = value ? parseFloat(value) : undefined;
      } else {
        processedData[field.name] = value || undefined;
      }
    });

    onSubmit(processedData as T);
  };

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-4`}>
          {fields.map((field) => (
            <FormField
              key={field.name}
              config={field}
              value={formData[field.name] || ''}
              onChange={(value) => handleFieldChange(field.name, value)}
              error={errors[field.name]}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-4 py-2 ${colorClasses[submitButtonColor]} text-white rounded-lg transition-colors font-medium`}
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </Modal>
  );
}