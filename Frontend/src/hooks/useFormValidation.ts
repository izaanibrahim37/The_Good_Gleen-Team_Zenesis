import { useState } from 'react';
import { checkRateLimit } from '../lib/supabase';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  passwordMatch?: string;
  customValidation?: (value: string) => string | null;
}

interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormValidationReturnType {
  errors: FormErrors;
  validateField: (name: string, value: string, rules: ValidationRules) => string;
  validateForm: (values: FormValues, validationRules: Record<string, ValidationRules>) => boolean;
  setError: (field: string, message: string) => void;
  clearErrors: () => void;
}

export const useFormValidation = (initialValues: FormValues): UseFormValidationReturnType => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string, rules: ValidationRules): string => {
    if (rules.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at most ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
    }

    if (rules.passwordMatch && value !== initialValues[rules.passwordMatch]) {
      return 'Passwords do not match';
    }

    if (rules.customValidation) {
      const customError = rules.customValidation(value);
      if (customError) return customError;
    }

    return '';
  };

  const validateForm = (values: FormValues, validationRules: Record<string, ValidationRules>): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName] || '', validationRules[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    // Check rate limiting for email field if it exists
    if (values.email && !checkRateLimit(values.email)) {
      newErrors.email = 'Too many login attempts. Please try again later.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const setError = (field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    validateForm,
    setError,
    clearErrors
  };
};