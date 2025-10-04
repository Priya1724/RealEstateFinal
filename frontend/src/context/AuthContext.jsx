import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'realnest_token';
const USER_KEY = 'realnest_user';

const loadInitialState = () => {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const user = window.localStorage.getItem(USER_KEY);
  return {
    token,
    user: user ? JSON.parse(user) : null
  };
};

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuthState] = useState(loadInitialState);

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      window.localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }, []);

  const setAuth = useCallback((nextToken, nextUser) => {
    setAuthState({ token: nextToken, user: nextUser });
    persist(nextToken, nextUser);
  }, [persist]);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setAuth(data.token, data.user);
    return data.user;
  }, [setAuth]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setAuth(data.token, data.user);
    return data.user;
  }, [setAuth]);

  const logout = useCallback(() => {
    setAuth(null, null);
  }, [setAuth]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout
  }), [token, user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
