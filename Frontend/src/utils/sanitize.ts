// Input sanitization utilities

/**
 * Sanitizes string input to prevent XSS attacks
 * @param input The string to sanitize
 * @returns A sanitized version of the input string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Replace potentially dangerous characters with HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes an email address
 * @param email The email address to sanitize
 * @returns A sanitized version of the email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  // Trim whitespace and lowercase
  email = email.trim().toLowerCase();
  
  // Basic email format validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Return empty string if format is invalid
    return '';
  }
  
  return sanitizeInput(email);
}

/**
 * Validates and sanitizes form data
 * @param formData Object containing form data
 * @returns Sanitized form data object
 */
export function sanitizeFormData<T extends Record<string, string>>(formData: T): T {
  const sanitized = { ...formData };
  
  for (const key in sanitized) {
    if (key === 'email') {
      sanitized[key] = sanitizeEmail(sanitized[key]);
    } else {
      sanitized[key] = sanitizeInput(sanitized[key]);
    }
  }
  
  return sanitized;
}