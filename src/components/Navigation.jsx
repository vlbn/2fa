import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Home,
  Lock,
  Fingerprint,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 font-bold text-xl hover:text-blue-600 transition-colors"
            >
              <Shield className="w-6 h-6 text-blue-500" />
              <span>PasskeyDemo</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 transition-colors ${
                  isActive("/")
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/protected"
                className={`flex items-center space-x-2 transition-colors ${
                  isActive("/protected")
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Área Protegida</span>
              </Link>
            </div>
          </div>

          {/* Estado de autenticación y acciones */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentUser}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Salir</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Autenticarse</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/protected"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/protected")
                  ? "text-blue-600 bg-blue-50 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Protegida</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
