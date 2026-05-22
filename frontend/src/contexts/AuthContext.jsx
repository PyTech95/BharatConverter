import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("bbp_token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch {
        localStorage.removeItem("bbp_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("bbp_token", data.token);
    setToken(data.token);
    setUser({ email: data.email, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("bbp_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
