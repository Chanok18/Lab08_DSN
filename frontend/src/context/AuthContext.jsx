import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('techstore_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('techstore_token'));
  const [mfaPendingEmail, setMfaPendingEmail] = useState(null);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setMfaPendingEmail(null);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.mfaRequired) {
      setMfaPendingEmail(res.email);
      return { mfaRequired: true, email: res.email, message: res.message };
    }

    return res;
  };

  const verifyMFA = async (email, code) => {
    const res = await apiRequest('/auth/verify-mfa', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });

    if (res.token && res.user) {
      localStorage.setItem('techstore_token', res.token);
      localStorage.setItem('techstore_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setMfaPendingEmail(null);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('techstore_token');
    localStorage.removeItem('techstore_user');
    setToken(null);
    setUser(null);
    setMfaPendingEmail(null);
  };

  const setSessionFromSocial = (tokenVal, userVal) => {
    localStorage.setItem('techstore_token', tokenVal);
    localStorage.setItem('techstore_user', JSON.stringify(userVal));
    setToken(tokenVal);
    setUser(userVal);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        mfaPendingEmail,
        setMfaPendingEmail,
        login,
        verifyMFA,
        register,
        logout,
        setSessionFromSocial
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
