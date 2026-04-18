import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import React from 'react';
import type { MissionStatus } from '../types';
import { MISSION_POINTS } from '../utils/missions';

const statusLabel: Record<MissionStatus, string> = {
  bloqueada: 'Bloqueada',
  pendiente: 'Pendiente',
  completada: 'Completada',
};

const statusColor: Record<MissionStatus, string> = {
  bloqueada: 'medium',
  pendiente: 'warning',
  completada: 'success',
} as const;

type Props = {
  title: string;
  description: string;
  points?: number;
  status: MissionStatus;
  children?: React.ReactNode;
};

export const MissionCard: React.FC<Props> = ({
  title,
  description,
  points = MISSION_POINTS,
  status,
  children,
}) => (
  <IonCard>
    <IonCardHeader>
      <IonCardSubtitle>
        <IonBadge color={statusColor[status]}>{statusLabel[status]}</IonBadge>
        <span style={{ marginLeft: 8 }}>{points} puntos</span>
      </IonCardSubtitle>
      <IonCardTitle>{title}</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      <p>{description}</p>
      {children}
    </IonCardContent>
  </IonCard>
);
