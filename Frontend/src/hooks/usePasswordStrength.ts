import { useState } from 'react';

interface UsePasswordStrengthReturnType {
  passwordStrength: number;
  checkPasswordStrength: (password: string) => number;
  getStrengthColor: () => string;
  getStrengthText: () => string;
}

export const usePasswordStrength = (): UsePasswordStrengthReturnType => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string): number => {
    if (!password) {
      setPasswordStrength(0);
      return 0;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Uppercase letter check
    if (/[A-Z]/.test(password)) strength += 1;

    // Numbers check
    if (/[0-9]/.test(password)) strength += 1;

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
    return strength;
  };

  const getStrengthColor = (): string => {
    switch (passwordStrength) {
      case 0:
        return 'bg-gray-200';
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-400';
      case 4:
        return 'bg-green-600';
      default:
        return 'bg-gray-200';
    }
  };

  const getStrengthText = (): string => {
    switch (passwordStrength) {
      case 0:
        return '';
      case 1:
        return 'Weak password';
      case 2:
        return 'Moderate password';
      case 3:
        return 'Strong password';
      case 4:
        return 'Very strong password';
      default:
        return '';
    }
  };

  return {
    passwordStrength,
    checkPasswordStrength,
    getStrengthColor,
    getStrengthText,
  };
};