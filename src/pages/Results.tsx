import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useMemo } from 'react';
import { useMissions } from '../context/MissionsContext';
import { completedCount, progressPercent } from '../utils/missions';

const Results: React.FC = () => {
  const { progress } = useMissions();
  const done = completedCount(progress.missions);
  const pct = progressPercent(progress.missions);

  const estado = useMemo(() => {
    if (done === 0) return 'Recien empezando';
    if (done < 3) return 'En progreso';
    return 'Completado';
  }, [done]);

  const mensaje = useMemo(() => {
    if (done === 0) return 'Aun no completaste misiones. Empieza por la foto de evidencia.';
    if (done === 1) return 'Buen comienzo. Continua con las siguientes misiones.';
    if (done === 2) return 'Falta una mision para terminar.';
    return 'Completaste todas las misiones.';
  }, [done]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Resultados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Resumen</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Puntos: <strong>{progress.points}</strong>
            </p>
            <p>
              Misiones completadas: <strong>{done}</strong> / 3
            </p>
            <p>
              Progreso: <strong>{pct}%</strong>
            </p>
            <IonProgressBar value={pct / 100} />
            <p className="ion-margin-top">
              Estado: <strong>{estado}</strong>
            </p>
            <p>{mensaje}</p>
            <IonButton expand="block" routerLink="/ranking" className="ion-margin-top">
              Ver ranking
            </IonButton>
            <IonButton expand="block" fill="outline" routerLink="/home">
              Volver al inicio
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Results;
