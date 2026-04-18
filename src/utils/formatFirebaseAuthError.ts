import { FirebaseError } from 'firebase/app';

export function formatFirebaseAuthError(err: unknown): string {
  if (err instanceof FirebaseError) {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'Ese correo ya esta registrado. Prueba iniciar sesion.',
      'auth/invalid-email': 'El correo no tiene un formato valido.',
      'auth/invalid-credential': 'Correo o contrasena incorrectos.',
      'auth/wrong-password': 'Contrasena incorrecta.',
      'auth/user-not-found': 'No existe una cuenta con ese correo.',
      'auth/weak-password': 'La contrasena es muy debil (minimo 6 caracteres).',
      'auth/operation-not-allowed':
        'El inicio con correo no esta habilitado en Firebase (Authentication, metodo correo).',
      'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
      'auth/network-request-failed': 'Error de red. Comprueba tu conexion.',
    };
    return map[err.code] ?? `${err.code}: ${err.message}`;
  }
  if (err instanceof Error) return err.message;
  return 'Error desconocido';
}
