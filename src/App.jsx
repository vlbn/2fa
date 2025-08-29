import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProtectedPage from "./pages/ProtectedPage";
import "./index.css"; // Importar estilos de Tailwind

/**
 * Componente principal de la aplicación
 * Configura el router y los providers necesarios
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navegación global */}
          <Navigation />

          {/* Rutas principales */}
          <Routes>
            {/* Página home - Pública */}
            <Route path="/" element={<HomePage />} />

            {/* Página de autenticación - Pública */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Página protegida - Requiere passkey */}
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedPage />
                </ProtectedRoute>
              }
            />

            {/* Redirigir rutas no encontradas al home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
