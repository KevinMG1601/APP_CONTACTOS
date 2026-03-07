import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonToast,
  IonLoading,
  IonIcon,
} from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

const CREDENCIALES_PRUEBA: Record<string, { password: string; nombre: string; rol: string; avatar: string | null }> = {
  'recepcion@clinica.com': {
    password: '123456',
    nombre: 'Andres',
    rol: 'recepcionista',
    avatar: null,
  },
  'medico@clinica.com': {
    password: '123456',
    nombre: 'Dr. Kevin',
    rol: 'medico',
    avatar: null,
  },
};

interface LoginPageProps {
  onLogin: (usuario: { email: string; nombre: string; rol: string; avatar: string | null }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = CREDENCIALES_PRUEBA[email];
    if (!user || user.password !== password) {
      setShowErrorToast(true);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const usuario = {
      email,
      nombre: user.nombre,
      rol: user.rol,
      avatar: user.avatar,
    };
    setIsLoading(false);
    onLogin(usuario);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MediCare+</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <div className="ion-padding" style={{ maxWidth: 400, margin: '0 auto', paddingTop: '2rem' }}>
          <img src="/logo.png" alt="Logo de la clinica" className="w-full max-w-[200px] mx-auto mb-4 block" />
          <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Iniciar sesion</h1>
          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value ?? '')}
                placeholder="medico@clinica.com"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onIonInput={(e) => setPassword(e.detail.value ?? '')}
                placeholder="••••••••"
                required
              />
              <IonButton
                fill="clear"
                slot="end"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
            <IonButton expand="block" type="submit" className="ion-margin-top">
              Entrar
            </IonButton>
          </form>
        </div>

        <IonToast
          isOpen={showErrorToast}
          onDidDismiss={() => setShowErrorToast(false)}
          message="Usuario o contraseña incorrectos"
          duration={3000}
          color="danger"
        />

        <IonLoading
          isOpen={isLoading}
          message="Verificando credenciales..."
          duration={1500}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
