import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { UserRole, getUserRole } from '../lib/supabase';

interface UserRoleContextType {
  role: UserRole | null;
  loading: boolean;
  setRole: (role: UserRole) => void;
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  loading: true,
  setRole: () => {},
});

export const useUserRole = () => useContext(UserRoleContext);

interface UserRoleProviderProps {
  children: React.ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRoleState(null);
        setLoading(false);
        return;
      }

      try {
        // Get user role from metadata
        const userRole = await getUserRole();
        setRoleState(userRole || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRoleState(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  return (
    <UserRoleContext.Provider value={{ role, loading, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};