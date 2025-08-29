/**
 * Utilidades para manejar WebAuthn y conversiones de datos
 */
export const webAuthnUtils = {
  // Convertir ArrayBuffer a base64url
  arrayBufferToBase64url: (buffer) => {
    const bytes = new Uint8Array(buffer);
    let str = "";
    for (const byte of bytes) {
      str += String.fromCharCode(byte);
    }
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  },

  // Convertir base64url a ArrayBuffer
  base64urlToArrayBuffer: (base64url) => {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  },

  // Generar challenge aleatorio para WebAuthn
  generateChallenge: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return array;
  },

  // Verificar si WebAuthn es soportado
  isSupported: () => {
    return (
      window.PublicKeyCredential &&
      navigator.credentials &&
      navigator.credentials.create &&
      navigator.credentials.get
    );
  },

  // Verificar si biometría está disponible
  checkBiometricSupport: async () => {
    try {
      if (!webAuthnUtils.isSupported()) {
        return { supported: false, reason: "WebAuthn no soportado" };
      }

      // Verificar si hay autenticadores disponibles
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      return {
        supported: available,
        reason: available ? "Biometría disponible" : "Sin biometría disponible",
      };
    } catch (error) {
      return {
        supported: false,
        reason: "Error verificando soporte biométrico",
      };
    }
  },
};

/**
 * Simulación de backend para demo (en producción esto sería una API real)
 */
export const mockBackend = {
  // Simular base de datos con localStorage
  users: JSON.parse(localStorage.getItem("passkey_users") || "{}"),

  // Guardar usuario con su passkey
  saveUser: function (username, credentialId, publicKey) {
    this.users[username] = {
      credentialId,
      publicKey,
      createdAt: Date.now(),
    };
    localStorage.setItem("passkey_users", JSON.stringify(this.users));
    console.log("Usuario guardado:", username);
  },

  // Obtener datos del usuario
  getUser: function (username) {
    return this.users[username] || null;
  },

  // Verificar si usuario existe
  userExists: function (username) {
    return !!this.users[username];
  },

  // Eliminar usuario (para testing)
  deleteUser: function (username) {
    delete this.users[username];
    localStorage.setItem("passkey_users", JSON.stringify(this.users));
    console.log("Usuario eliminado:", username);
  },

  // Listar todos los usuarios (para debugging)
  listUsers: function () {
    return Object.keys(this.users);
  },
};
