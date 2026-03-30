import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginCustomer, setAuthToken, signupCustomer } from "../api/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "customerToken";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const hydrateAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setAuthLoading(false);
        return;
      }

      setAuthToken(token);
      try {
        const { user: me } = await getMe();
        setUser(me);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginCustomer(credentials);
    localStorage.setItem(TOKEN_KEY, response.token);
    setAuthToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const signup = async (payload) => {
    const response = await signupCustomer(payload);
    localStorage.setItem(TOKEN_KEY, response.token);
    setAuthToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      login,
      signup,
      logout,
      updateUser,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
