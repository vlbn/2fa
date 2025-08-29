import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Fingerprint,
  Key,
  CheckCircle,
  AlertCircle,
  Loader,
  Shield,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { webAuthnUtils, mockBackend } from "../utils/webauthn";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // 'login' o 'register'
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [biometricSupport, setBiometricSupport] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/protected";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Verificar soporte biométrico al cargar
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const support = await webAuthnUtils.checkBiometricSupport();
    setBiometricSupport(support);
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      setError("Por favor ingresa un nombre de usuario");
      return;
    }

    if (username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }

    if (mockBackend.userExists(username)) {
      setError(
        "Este usuario ya existe. Intenta hacer login o usar otro nombre."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Verificar soporte WebAuthn
      if (!webAuthnUtils.isSupported()) {
        throw new Error(
          "Tu navegador no soporta WebAuthn. Actualiza tu navegador o usa uno compatible."
        );
      }

      const challenge = webAuthnUtils.generateChallenge();

      // Configurar opciones para crear credencial
      const createOptions = {
        publicKey: {
          challenge: challenge,
          rp: {
            name: "PasskeyDemo",
            id: window.location.hostname, // localhost o tu dominio
          },
          user: {
            id: new TextEncoder().encode(username),
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Prefiere Touch ID, Windows Hello, etc.
            userVerification: "required",
            residentKey: "preferred",
          },
          timeout: 60000,
          attestation: "direct",
        },
      };

      setSuccess(
        "Configurando tu passkey... Sigue las instrucciones de tu dispositivo."
      );

      // Crear credencial WebAuthn
      const credential = await navigator.credentials.create(createOptions);

      if (!credential) {
        throw new Error("No se pudo crear el passkey. Inténtalo de nuevo.");
      }

      // Guardar en backend simulado
      mockBackend.saveUser(
        username,
        webAuthnUtils.arrayBufferToBase64url(credential.rawId),
        webAuthnUtils.arrayBufferToBase64url(credential.response.getPublicKey())
      );

      setSuccess("¡Passkey creado exitosamente! Redirigiendo...");

      // Login automático y redirección
      setTimeout(() => {
        login(username);
        const from = location.state?.from?.pathname || "/protected";
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Error creando passkey:", err);

      if (err.name === "NotAllowedError") {
        setError(
          "Operación cancelada. Por favor, inténtalo de nuevo y autoriza la creación del passkey."
        );
      } else if (err.name === "InvalidStateError") {
        setError("Ya existe un passkey para este usuario en este dispositivo.");
      } else if (err.name === "NotSupportedError") {
        setError("Tu dispositivo no soporta la creación de passkeys.");
      } else {
        setError(
          err.message ||
            "Error creando el passkey. Verifica que tu dispositivo tenga biometría configurada."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("Por favor ingresa tu nombre de usuario");
      return;
    }

    const userData = mockBackend.getUser(username);
    if (!userData) {
      setError("Usuario no encontrado. ¿Necesitas registrarte primero?");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const challenge = webAuthnUtils.generateChallenge();

      // Configurar opciones para autenticación
      const getOptions = {
        publicKey: {
          challenge: challenge,
          allowCredentials: [
            {
              id: webAuthnUtils.base64urlToArrayBuffer(userData.credentialId),
              type: "public-key",
            },
          ],
          userVerification: "required",
          timeout: 60000,
        },
      };

      setSuccess("Autenticando... Usa tu passkey para continuar.");

      // Obtener credencial existente
      const assertion = await navigator.credentials.get(getOptions);

      if (!assertion) {
        throw new Error("No se pudo verificar el passkey.");
      }

      // En un backend real, aquí verificarías la firma criptográfica
      // Por ahora, si llegamos aquí es que la autenticación fue exitosa

      setSuccess("¡Autenticación exitosa! Accediendo...");

      setTimeout(() => {
        login(username);
        const from = location.state?.from?.pathname || "/protected";
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Error autenticando:", err);

      if (err.name === "NotAllowedError") {
        setError("Autenticación cancelada. Inténtalo de nuevo.");
      } else if (err.name === "InvalidStateError") {
        setError(
          "Error con el passkey. Puede que necesites registrarte de nuevo."
        );
      } else {
        setError(
          err.message || "Error en la autenticación. Verifica tu passkey."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setError("");
    setSuccess("");
    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {mode === "register" ? "Crear Passkey" : "Iniciar Sesión"}
            </h2>
            <p className="text-gray-600 mt-2">
              {mode === "register"
                ? "Crea tu passkey para acceso seguro sin contraseñas"
                : "Usa tu passkey existente para autenticarte"}
            </p>
          </div>

          {/* Soporte biométrico */}
          {biometricSupport && (
            <div
              className={`mb-6 p-3 rounded-lg border ${
                biometricSupport.supported
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  biometricSupport.supported
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                {biometricSupport.supported ? "✅ " : "⚠️ "}
                {biometricSupport.reason}
              </p>
            </div>
          )}

          {/* Toggle entre registro y login */}
          <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchMode("login")}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => switchMode("register")}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="mi-usuario"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Mensajes de estado */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Éxito</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Botón de acción */}
            <button
              type="button"
              onClick={mode === "register" ? handleRegister : handleLogin}
              disabled={loading || !username.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  <span>
                    {mode === "register"
                      ? "Crear Passkey"
                      : "Autenticar con Passkey"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <Shield className="w-4 h-4" />
              <span>Protegido por WebAuthn/FIDO2</span>
            </div>

            <p className="text-xs text-gray-500">
              {mode === "register"
                ? "¿Ya tienes una cuenta? "
                : "¿No tienes cuenta? "}
              <button
                onClick={() =>
                  switchMode(mode === "register" ? "login" : "register")
                }
                disabled={loading}
                className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
              >
                {mode === "register" ? "Iniciar sesión" : "Regístrate"}
              </button>
            </p>
          </div>

          {/* Debug info (solo en desarrollo) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">
                🔧 Usuarios registrados:
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                {mockBackend.listUsers().length > 0 ? (
                  mockBackend
                    .listUsers()
                    .map((user) => <div key={user}>• {user}</div>)
                ) : (
                  <div>No hay usuarios registrados</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
