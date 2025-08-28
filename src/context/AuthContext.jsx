import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES, PERMISSIONS } from '../utils/constants';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedRole = sessionStorage.getItem('userRole');

    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (role, userData = null) => {
    const user = userData || { 
      id: 'U001',
      name: 'Demo User', 
      email: 'demo@company.com',
      role 
    };

    setUser(user);
    setUserRole(role);
    setIsAuthenticated(true);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('userRole', role);
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userRole');
  };

  const hasPermission = (requiredPermission) => {
    if (!userRole) return false;
    const userPermissions = PERMISSIONS[userRole] || [];
    return userPermissions.includes(requiredPermission);
  };

  const canAccessResource = (resource) => {
    switch (resource) {
      case 'employees':
        return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER;
      case 'departments':
        return userRole === USER_ROLES.ADMIN;
      case 'projects':
        return userRole !== USER_ROLES.EMPLOYEE;
      case 'invoices':
        return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER;
      case 'reports':
        return true;
      default:
        return false;
    }
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    canAccessResource
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
