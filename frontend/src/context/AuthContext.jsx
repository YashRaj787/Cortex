import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth.js";
import { getToken, setToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(() => Boolean(getToken()));

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setBooting(false);
      return;
    }

    authApi
      .getMe()
      .then((profile) => setUser(profile))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, []);

  async function login(email, password) {
    const result = await authApi.login(email, password);
    setToken(result.token);
    const profile = await authApi.getMe();
    setUser(profile);
    return profile;
  }

  async function signup(name, email, password) {
    await authApi.signup(name, email, password);
    return login(email, password);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    booting,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
