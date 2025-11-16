import { createContext, useState } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      localStorage.removeItem("authUser");
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem("authToken") || null;
  });

  const login = (data) => {
    localStorage.setItem("authUser", JSON.stringify(data.user));
    setAuthUser(data.user);

    localStorage.setItem("authToken", data.token);
    setAuthToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);

    localStorage.removeItem("authToken");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
