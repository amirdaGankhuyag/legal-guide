import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuth(true);
      const role = jwtDecode(token)?.role;
      setIsAdmin(role === "admin");
    } else {
      setIsAuth(false);
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  const login = (token) => {
    localStorage.setItem("token", token);
    const role = jwtDecode(token).role;
    setIsAuth(true);
    setIsAdmin(role === "admin");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
