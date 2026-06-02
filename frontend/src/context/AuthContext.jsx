import { createContext, useContext, useEffect, useState } from 'react';
import { energyApi } from '../api/energyApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('energyhome-token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('energyhome-user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const syncProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await energyApi.profile();
        setUser(profile);
        localStorage.setItem('energyhome-user', JSON.stringify(profile));
      } finally {
        setLoading(false);
      }
    };

    syncProfile();
  }, [token]);

  const authenticate = (authResponse) => {
    localStorage.setItem('energyhome-token', authResponse.token);
    localStorage.setItem('energyhome-user', JSON.stringify(authResponse.user));
    setToken(authResponse.token);
    setUser(authResponse.user);
  };

  const signOut = () => {
    localStorage.removeItem('energyhome-token');
    localStorage.removeItem('energyhome-user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token),
        authenticate,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}