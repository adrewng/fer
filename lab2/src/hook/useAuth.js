import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

export default function useAuth() {
  const { user, login, logout } = useContext(AuthContext);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      login(JSON.parse(userData));
    }
  }, [login]);
  return { user, login, logout };
}
