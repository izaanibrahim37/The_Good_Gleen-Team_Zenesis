export interface User {
  id: string;
  email: string;
  user_metadata: {
    role: UserRole;
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
}

export type UserRole = 'farmer' | 'retailer' | 'ngo';

export interface AuthFormFields {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}