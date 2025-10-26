import { createContext, useCallback, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback(
    (userData) => {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    },
    [setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
