import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // Нэвтэрсэн хэрэглэгчийн ID — өөрийн сэтгэгдлээ таних зэрэгт хэрэглэнэ
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuth(true);
      // const role = jwtDecode(token)?.role;
      const decoded = jwtDecode(token);
      setIsAdmin(decoded?.role === "admin");
      setUserId(decoded?.id || null);
    } else {
      setIsAuth(false);
      setIsAdmin(false);
      setUserId(null);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  const login = (token) => {
    localStorage.setItem("token", token);
    // const role = jwtDecode(token).role;
    const decoded = jwtDecode(token);
    setIsAuth(true);
    setIsAdmin(decoded?.role === "admin");
    setUserId(decoded?.id || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setIsAdmin(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuth, isAdmin, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
