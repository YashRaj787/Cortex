import { useCallback, useEffect, useState } from "react";
import * as authApi from "../api/auth.js";
import { getToken, setToken } from "../api/client.js";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialToken] = useState(getToken);
  const [booting, setBooting] = useState(() => Boolean(initialToken));

  useEffect(() => {
    if (!initialToken) return;

    authApi
      .getMe()
      .then((profile) => setUser(profile))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, [initialToken]);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    setToken(result.token);
    const profile = await authApi.getMe();
    setUser(profile);
    return profile;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    await authApi.signup(name, email, password);
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

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
