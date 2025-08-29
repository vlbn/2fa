import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * Componente que protege rutas requiriendo autenticación con passkey
 * Redirige a /auth si el usuario no está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verificando autenticación...
          </h2>
          <p className="text-gray-600">
            Por favor espera mientras verificamos tu passkey
          </p>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido protegido
  if (isAuthenticated) {
    return children;
  }

  // Si no está autenticado, redirigir a /auth con la ubicación actual
  // Esto permite redirigir de vuelta después de la autenticación
  return <Navigate to="/auth" state={{ from: location }} replace />;
};

/**
 * Componente alternativo que muestra una página de acceso denegado
 * en lugar de redirigir automáticamente (opcional)
 */
export const ProtectedRouteWithMessage = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  // Mostrar página de acceso denegado en lugar de redirección automática
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Passkey Requerido</span>
            </div>
            <p className="text-sm text-yellow-600 mt-2">
              Esta área requiere autenticación con passkey para acceder
            </p>
          </div>

          <p className="text-gray-600 mb-8">
            Necesitas autenticarte usando tu passkey (biometría o PIN de
            seguridad) para acceder a esta página protegida.
          </p>

          <div className="space-y-3">
            <Navigate to="/auth" state={{ from: location }} replace />

            <p className="text-xs text-gray-500">
              Serás redirigido de vuelta aquí después de autenticarte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
