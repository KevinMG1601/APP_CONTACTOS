import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { logOutOutline, trophyOutline } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MissionCard } from '../components/MissionCard';
import { useAuth } from '../context/AuthContext';
import { useMissions } from '../context/MissionsContext';
import { useAccelerometerStillness } from '../hooks/useAccelerometerStillness';
import { useGeolocationMission } from '../hooks/useGeolocationMission';
import { captureAndSaveEvidence } from '../services/cameraService';
import { missionCompleteHaptics } from '../services/hapticsService';
import { requestNotificationPermission } from '../services/notificationsService';
import {
  completedCount,
  missionBlockedHint,
  MISSION_DEFINITIONS,
  missionStatus,
  progressPercent,
} from '../utils/missions';

const Home: React.FC = () => {
  const history = useHistory();
  const { displayName, logOut } = useAuth();
  const { progress, loading, refresh, completeMission } = useMissions();
  const [toast] = useIonToast();
  const geo = useGeolocationMission();
  const still = useAccelerometerStillness();

  useEffect(() => {
    void requestNotificationPermission();
  }, []);

  const pct = progressPercent(progress.missions);
  const done = completedCount(progress.missions);

  const onPhoto = async () => {
    try {
      const path = await captureAndSaveEvidence();
      const ok = await completeMission(1, { evidencePath: path });
      if (ok) {
        toast({ message: 'Mision 1 completada.', duration: 2000, color: 'success' });
      }
    } catch (e) {
      toast({
        message: e instanceof Error ? e.message : 'No se guardo la foto.',
        duration: 2600,
        color: 'danger',
      });
    }
  };

  const onMovementComplete = async () => {
    const ok = await completeMission(2);
    if (ok) {
      toast({ message: 'Mision 2 completada.', duration: 2000, color: 'success' });
    }
  };

  const onStillnessComplete = async () => {
    const ok = await completeMission(3);
    if (ok) {
      await missionCompleteHaptics();
      toast({ message: 'Mision 3 completada.', duration: 2200, color: 'success' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Misiones</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/ranking')}>
              <IonIcon icon={trophyOutline} />
            </IonButton>
            <IonButton
              onClick={async () => {
                await logOut();
                history.replace('/login');
              }}
            >
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (ev) => {
            await refresh();
            ev.detail.complete();
          }}
        >
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <div className="ion-padding">
            <h2>Hola, {displayName}</h2>
            <IonText color="medium">
              <p>
                Puntos: <strong>{progress.points}</strong>
              </p>
              <p>
                {done} de 3 misiones completadas — {pct}% de progreso
              </p>
            </IonText>
            <IonProgressBar value={pct / 100} buffer={1} />
            <IonButton expand="block" className="ion-margin-top" routerLink="/results" color="tertiary">
              Ver resultados
            </IonButton>
            {MISSION_DEFINITIONS.map((def) => {
              const st = missionStatus(
                progress.missions.find((m) => m.id === def.id)!,
                progress.missions
              );
              const blockedHint = missionBlockedHint(def.id, progress.missions);
              return (
                <MissionCard
                  key={def.id}
                  title={def.title}
                  description={def.description}
                  points={def.points}
                  status={st}
                >
                  {blockedHint && (
                    <IonText color="medium">
                      <p className="ion-margin-top ion-no-margin">
                        <small>{blockedHint}</small>
                      </p>
                    </IonText>
                  )}
                  {def.id === 1 && st === 'pendiente' && (
                    <IonButton expand="block" onClick={() => void onPhoto()}>
                      Tomar foto
                    </IonButton>
                  )}
                  {def.id === 2 && st === 'pendiente' && (
                    <>
                      {!geo.active && (
                        <IonButton
                          expand="block"
                          onClick={() => void geo.start(() => void onMovementComplete())}
                        >
                          Iniciar seguimiento de ubicacion
                        </IonButton>
                      )}
                      {geo.active && (
                        <IonText>
                          <p>
                            Distancia: <strong>{geo.distance.toFixed(1)} m</strong>
                          </p>
                          <IonButton color="medium" size="small" onClick={() => void geo.stop()}>
                            Detener
                          </IonButton>
                        </IonText>
                      )}
                      {geo.error && (
                        <IonText color="danger">
                          <p>{geo.error}</p>
                        </IonText>
                      )}
                    </>
                  )}
                  {def.id === 3 && st === 'pendiente' && (
                    <>
                      {!still.active && (
                        <IonButton expand="block" onClick={() => void still.start(() => void onStillnessComplete())}>
                          Iniciar permanencia (10 s quieto)
                        </IonButton>
                      )}
                      {still.active && (
                        <IonText>
                          <p>
                            Tiempo quieto: <strong>{(still.quietMs / 1000).toFixed(1)} s</strong> / 10 s
                          </p>
                          <IonButton color="medium" size="small" onClick={() => void still.stop()}>
                            Cancelar
                          </IonButton>
                        </IonText>
                      )}
                      {still.error && (
                        <IonText color="danger">
                          <p>{still.error}</p>
                        </IonText>
                      )}
                    </>
                  )}
                </MissionCard>
              );
            })}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
