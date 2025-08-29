import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Fingerprint,
  Key,
  Lock,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { webAuthnUtils } from "../utils/webauthn";

const HomePage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [biometricSupport, setBiometricSupport] = useState(null);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const support = await webAuthnUtils.checkBiometricSupport();
    setBiometricSupport(support);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header principal */}
        <div className="text-center mb-16">
          <Shield className="w-24 h-24 text-blue-500 mx-auto mb-8" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Demo de Passkeys
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experimenta la autenticación del futuro: sin contraseñas,
            completamente segura, usando la biometría de tu dispositivo o PIN de
            seguridad.
          </p>

          {/* Estado de autenticación */}
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold mb-4">Estado actual:</h3>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Autenticado como {currentUser}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    ✅ Puedes acceder al área protegida
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">No autenticado</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    🔒 Necesitas un passkey para acceder al área protegida
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Soporte biométrico */}
        {biometricSupport && (
          <div className="max-w-md mx-auto mb-12">
            <div
              className={`p-4 rounded-lg border ${
                biometricSupport.supported
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}
            >
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Smartphone className="w-4 h-4" />
                <span>{biometricSupport.reason}</span>
              </div>
            </div>
          </div>
        )}

        {/* Características de los Passkeys */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Fingerprint className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Biometría Avanzada</h3>
            <p className="text-gray-600 mb-4">
              Usa tu huella digital, Face ID, Windows Hello o reconocimiento
              facial para una autenticación instantánea y segura.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Touch ID / Face ID (iOS/Mac)</li>
              <li>• Windows Hello</li>
              <li>• Huella dactilar Android</li>
              <li>• PIN de seguridad</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Key className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sin Contraseñas</h3>
            <p className="text-gray-600 mb-4">
              Olvídate para siempre de recordar contraseñas complejas. Tu
              dispositivo es tu credencial de autenticación.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• No más contraseñas olvidadas</li>
              <li>• Sin riesgo de filtración</li>
              <li>• Imposible de adivinar</li>
              <li>• Único por dispositivo</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Máxima Seguridad</h3>
            <p className="text-gray-600 mb-4">
              Los passkeys nunca salen de tu dispositivo. Utilizan criptografía
              de clave pública para una seguridad inquebrantable.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Criptografía de clave pública</li>
              <li>• Resistente a phishing</li>
              <li>• Sin datos compartidos</li>
              <li>• Estándar WebAuthn/FIDO2</li>
            </ul>
          </div>
        </div>

        {/* Ventajas adicionales */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            ¿Por qué Passkeys?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="font-bold mb-2">Velocidad</h4>
              <p className="text-sm text-gray-600">
                Autenticación instantánea con un toque o mirada
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-bold mb-2">Universal</h4>
              <p className="text-sm text-gray-600">
                Funciona en todos los navegadores y dispositivos modernos
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-bold mb-2">Privacidad</h4>
              <p className="text-sm text-gray-600">
                Tus credenciales nunca abandonan tu dispositivo
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">¡Pruébalo ahora!</h2>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
              >
                <Fingerprint className="w-5 h-5" />
                <span>Crear mi Passkey</span>
              </Link>
            ) : (
              <Link
                to="/protected"
                className="inline-flex items-center space-x-2 bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
              >
                <Lock className="w-5 h-5" />
                <span>Acceder al Área Protegida</span>
              </Link>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            * Necesitas un dispositivo compatible con biometría o PIN de
            seguridad
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
