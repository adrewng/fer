import { createContext, useCallback, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback(
    (userData) => {
      console.log("login called");
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    },
    [setUser]
  );

  const logout = useCallback(() => {
    console.log("logout called");
    setUser(null);
    localStorage.removeItem("user");
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
