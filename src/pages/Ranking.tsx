import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMissions } from '../context/MissionsContext';
import { buildTopRanking } from '../utils/ranking';

const Ranking: React.FC = () => {
  const { displayName } = useAuth();
  const { progress } = useMissions();
  const rows = useMemo(
    () => buildTopRanking(displayName, progress.points),
    [displayName, progress.points]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Ranking</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          {rows.map((r) => (
            <IonItem key={`${r.position}-${r.name}`} color={r.isCurrentUser ? 'light' : undefined}>
              <IonLabel>
                <h2>
                  #{r.position} {r.name}
                  {r.isCurrentUser && (
                    <IonNote style={{ marginLeft: 8 }} color="primary">
                      (tu usuario)
                    </IonNote>
                  )}
                </h2>
                <p>{r.score} puntos</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Ranking;
