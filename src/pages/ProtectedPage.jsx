import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  User,
  CheckCircle,
  Shield,
  Fingerprint,
  Key,
  Clock,
  Smartphone,
  Globe,
  LogOut,
  Settings,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { mockBackend } from "../utils/webauthn";

const ProtectedPage = () => {
  const { currentUser, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    loadUserInfo();
    loadSessionInfo();
  }, [currentUser]);

  const loadUserInfo = () => {
    if (currentUser) {
      const userData = mockBackend.getUser(currentUser);
      if (userData) {
        setUserInfo({
          ...userData,
          registeredAt: new Date(userData.createdAt).toLocaleDateString(
            "es-ES",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        });
      }
    }
  };

  const loadSessionInfo = () => {
    const authData = JSON.parse(sessionStorage.getItem("passkey_auth") || "{}");
    if (authData.timestamp) {
      setSessionInfo({
        loginTime: new Date(authData.timestamp).toLocaleString("es-ES"),
        sessionDuration: Math.floor(
          (Date.now() - authData.timestamp) / 1000 / 60
        ), // minutos
        browser: navigator.userAgent.split(" ").pop(),
        platform: navigator.platform,
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header de bienvenida */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 ¡Bienvenido al Área Protegida!
          </h1>

          <p className="text-xl text-gray-600 mb-2">
            Solo usuarios autenticados con passkey pueden acceder aquí
          </p>

          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Autenticado como {currentUser}</span>
          </div>
        </div>

        {/* Panel de información de la sesión */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Información del usuario */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Información del Usuario</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Usuario:</span>
                </div>
                <span className="text-blue-600 font-semibold">
                  {currentUser}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Método:</span>
                </div>
                <span className="text-purple-600 font-semibold">
                  WebAuthn Passkey
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <Fingerprint className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Estado:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-semibold">Activo</span>
                </div>
              </div>

              {userInfo && (
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">
                      Registrado:
                    </span>
                  </div>
                  <span className="text-gray-600">{userInfo.registeredAt}</span>
                </div>
              )}
            </div>
          </div>

          {/* Información de la sesión */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold">Información de la Sesión</h2>
            </div>

            {sessionInfo && (
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Inicio:</span>
                  </div>
                  <span className="text-gray-600">{sessionInfo.loginTime}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Duración:</span>
                  </div>
                  <span className="text-gray-600">
                    {sessionInfo.sessionDuration} minutos
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">
                      Plataforma:
                    </span>
                  </div>
                  <span className="text-gray-600 text-right text-sm">
                    {sessionInfo.platform}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">
                      Navegador:
                    </span>
                  </div>
                  <span className="text-gray-600 text-right text-sm">
                    {sessionInfo.browser}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Características de seguridad */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">
              Características de Seguridad de tu Passkey
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold mb-2">Criptografía Avanzada</h4>
              <p className="text-sm text-gray-600">
                Utiliza criptografía de clave pública con algoritmos ES256/RS256
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fingerprint className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold mb-2">Biometría Local</h4>
              <p className="text-sm text-gray-600">
                Tu huella/Face ID nunca sale de tu dispositivo
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold mb-2">Anti-Phishing</h4>
              <p className="text-sm text-gray-600">
                Imposible de replicar o robar mediante phishing
              </p>
            </div>
          </div>
        </div>

        {/* Panel de estadísticas divertidas */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 ¡Felicidades!</h2>
            <p className="text-lg mb-6 opacity-90">
              Acabas de experimentar la autenticación del futuro
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">0</div>
                <div className="text-sm opacity-75">Contraseñas usadas</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-75">Seguro</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-sm opacity-75">Veces más conveniente</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información técnica */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Info className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Información Técnica
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold mb-2">Estándar utilizado:</h4>
              <p>WebAuthn (Web Authentication API) / FIDO2</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Algoritmos soportados:</h4>
              <p>ES256 (ECDSA), RS256 (RSA-PSS)</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Verificación:</h4>
              <p>Requerida (biometría o PIN)</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tipo de autenticador:</h4>
              <p>Plataforma (integrado al dispositivo)</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>Volver al Home</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Tu sesión es segura y se mantendrá activa hasta que cierres el
            navegador
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedPage;
