import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

export default function useAuth() {
  const { user, setUser, login, logout } = useContext(AuthContext);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      login({ username: "Nguyễn Nhật Trường" });
    } else {
      setUser(userData);
    }
  }, [login, setUser]);
  return { user, login, logout };
}
