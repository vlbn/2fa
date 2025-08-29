import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Verificar soporte WebAuthn al inicializar la app
const checkWebAuthnSupport = () => {
  if (!window.PublicKeyCredential) {
    console.warn("⚠️ WebAuthn no está soportado en este navegador");
    console.info(
      "🔧 Para una experiencia completa, usa un navegador compatible como:"
    );
    console.info("   • Chrome 67+");
    console.info("   • Firefox 60+");
    console.info("   • Safari 13+");
    console.info("   • Edge 18+");
  } else {
    console.log("✅ WebAuthn está soportado");

    // Verificar disponibilidad de autenticador de plataforma
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      .then((available) => {
        if (available) {
          console.log("✅ Autenticador biométrico disponible");
        } else {
          console.log(
            "⚠️ Sin autenticador biométrico - se puede usar PIN o autenticador externo"
          );
        }
      })
      .catch((error) => {
        console.warn("❌ Error verificando autenticador:", error);
      });
  }
};

// Función para limpiar datos de desarrollo
const cleanupDevData = () => {
  if (import.meta.env.DEV) {
    // En desarrollo, puedes descomentar esto para limpiar datos al reiniciar
    // localStorage.removeItem('passkey_users');
    // sessionStorage.removeItem('passkey_auth');
    console.log("🔧 Modo desarrollo activado");
  }
};

// Inicializar aplicación
const initApp = () => {
  checkWebAuthnSupport();
  cleanupDevData();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log("🚀 PasskeyDemo iniciado correctamente");
};

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
