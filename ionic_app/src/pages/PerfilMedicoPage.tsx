import { useState, useRef } from 'react';
import {
  useIonViewWillLeave,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonImg,
  IonButton,
} from '@ionic/react';

function getIniciales(nombre: string | undefined): string {
  if (!nombre || !nombre.trim()) return '?';
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorPorNombre(nombre: string | undefined): string {
  const colores = [
    'var(--ion-color-primary)',
    'var(--ion-color-secondary)',
    '#d97706',
    '#dc2626',
    '#7c3aed',
  ];
  let hash = 0;
  for (let i = 0; i < (nombre || '').length; i++) hash += nombre.charCodeAt(i);
  return colores[Math.abs(hash) % colores.length];
}

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
  avatar: string | null;
}

interface PerfilMedicoPageProps {
  user: Usuario;
  onUpdateUser: (usuario: Usuario) => void;
  onLogout: () => void;
}

const PerfilMedicoPage: React.FC<PerfilMedicoPageProps> = ({ user, onUpdateUser, onLogout }) => {
  useIonViewWillLeave(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onUpdateUser({ ...user, avatar: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const iniciales = getIniciales(user?.nombre);
  const colorCircle = getColorPorNombre(user?.nombre);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--ion-color-medium)' }}>Avatar</p>
            {preview ? (
              <IonAvatar style={{ width: 96, height: 96 }}>
                <IonImg src={preview} alt="Avatar del médico" />
              </IonAvatar>
            ) : (
              <IonAvatar
                style={{
                  width: 96,
                  height: 96,
                  backgroundColor: colorCircle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 600,
                }}
              >
                {iniciales}
              </IonAvatar>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <IonButton fill="clear" size="small" onClick={() => inputRef.current?.click()}>
              Cambiar foto
            </IonButton>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Nombre:</strong> {user?.nombre}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong> {user?.email}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Rol:</strong> {user?.rol}
            </p>
          </div>

          <IonButton expand="block" color="medium" fill="outline" onClick={onLogout}>
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PerfilMedicoPage;
