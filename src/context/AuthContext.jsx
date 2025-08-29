import React, { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión activa al cargar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const savedAuth = sessionStorage.getItem("passkey_auth");
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);

        // Verificar si la sesión no ha expirado (24 horas)
        const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000;

        if (!isExpired) {
          setIsAuthenticated(true);
          setCurrentUser(authData.username);
        } else {
          // Limpiar sesión expirada
          logout();
        }
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (username) => {
    const authData = {
      username,
      timestamp: Date.now(),
    };

    setIsAuthenticated(true);
    setCurrentUser(username);
    sessionStorage.setItem("passkey_auth", JSON.stringify(authData));

    console.log("Usuario autenticado:", username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem("passkey_auth");

    console.log("Usuario desconectado");
  };

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
