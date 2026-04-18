import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatFirebaseAuthError } from '../utils/formatFirebaseAuthError';

const Login: React.FC = () => {
  const { user, ready, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast] = useIonToast();

  if (ready && user) {
    return <Redirect to="/home" />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      toast({ message: formatFirebaseAuthError(err), duration: 4000, color: 'danger' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Iniciar sesion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={onSubmit}>
          <IonList inset>
            <IonItem>
              <IonLabel position="stacked">Correo electronico</IonLabel>
              <IonInput
                type="email"
                autocomplete="email"
                value={email}
                onIonInput={(e) => setEmail(String(e.detail.value ?? ''))}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Contrasena</IonLabel>
              <IonInput
                type="password"
                autocomplete="current-password"
                value={password}
                onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
                required
              />
            </IonItem>
          </IonList>
          <IonButton expand="block" type="submit" disabled={busy}>
            {busy ? 'Espera...' : 'Entrar'}
          </IonButton>
        </form>
        <p className="ion-text-center ion-margin-top">
          No tienes cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Login;
