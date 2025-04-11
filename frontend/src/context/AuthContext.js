import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setToken(null);
    }
  }, []); // Run only on component mount

  const login = (userData) => {
    if (userData.token) {
      setToken(userData.token);
      setIsAuthenticated(true);
      localStorage.setItem('token', userData.token);
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('readingTestSentences');
    localStorage.removeItem('spellCheckWords'); // Clear spell check words
  };

  // Helper function to get the auth token for API requests
  const getAuthHeader = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 