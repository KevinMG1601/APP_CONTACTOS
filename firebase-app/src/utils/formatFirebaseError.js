export function formatFirebaseError(err) {
  if (!err?.code) return err?.message || 'Ha ocurrido un error.'
  const map = {
    'permission-denied': 'No tienes permiso para esta acción.',
    'auth/email-already-in-use': 'Ese correo ya está registrado.',
    'auth/invalid-email': 'El correo no es válido.',
    'auth/weak-password': 'La contraseña es demasiado débil (mín. 6 caracteres).',
    'auth/user-disabled': 'Esta cuenta está deshabilitada.',
    'auth/user-not-found': 'Usuario o contraseña incorrectos.',
    'auth/wrong-password': 'Usuario o contraseña incorrectos.',
    'auth/invalid-credential': 'Credenciales incorrectas.',
    'auth/too-many-requests': 'Demasiados intentos. Prueba más tarde.',
  }
  return map[err.code] || err.message || 'Ha ocurrido un error.'
}
