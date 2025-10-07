import { z } from 'zod';

// Esquemas de validación con Zod
export const emailSchema = z.string()
  .min(1, 'El correo es requerido')
  .email('Formato de email inválido');

export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número');

export const nameSchema = z.string()
  .min(1, 'Nombre es requerido')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede tener más de 50 caracteres');

// Esquemas completos para formularios
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Contraseña es requerida'),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Tipos TypeScript inferidos de los esquemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Función helper para validar y obtener errores formateados
export const validateField = <T>(schema: z.ZodSchema<T>, value: T) => {
  const result = schema.safeParse(value);
  if (result.success) {
    return { isValid: true, errors: [] };
  }
  return {
    isValid: false,
    errors: result.error.issues.map((err) => err.message),
  };
};

// Función para validar formularios completos
export const validateForm = <T>(schema: z.ZodSchema<T>, data: T) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: {}, data: result.data };
  }

  const formattedErrors: Record<string, string[]> = {};
  result.error.issues.forEach((err) => {
    const path = err.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(err.message);
  });

  return {
    isValid: false,
    errors: formattedErrors,
    data: null,
  };
};