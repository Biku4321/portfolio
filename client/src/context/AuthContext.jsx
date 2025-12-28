import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode }  from "jwt-decode";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optional: verify token shape/expiry
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (exp && Date.now() >= exp * 1000) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } catch { /* ignore decode errors */ }
    }
  }, [token]);

  const login = (jwt, navigate, location) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    const redirect = location?.state?.from?.pathname || "/admin/dashboard";
    navigate(redirect, { replace: true });
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    setToken(null);
    if (navigate) navigate("/admin/login", { replace: true });
  };

  const isAuthenticated = () => Boolean(token);

  return (
    <AuthContext.Provider value={{ token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;