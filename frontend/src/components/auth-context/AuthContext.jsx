/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      const parsedData = JSON.parse(userData);
      setIsLoggedIn(true);

      // Verifica se é admin ou candidato
      if (parsedData.dados.admin === 1) {
        setUserRole("admin");
      } else {
        setUserRole("candidate");
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, setIsLoggedIn, setUserRole }}>
      {loading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
};


