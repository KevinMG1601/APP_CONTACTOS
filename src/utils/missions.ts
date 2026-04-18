import type { MissionId, MissionProgress, MissionStatus } from '../types';

export const MISSION_POINTS = 40;
export const MOVEMENT_TARGET_METERS = 30;
export const STILLNESS_MS = 10_000;
export const MOTION_DELTA_THRESHOLD = 0.55;

export const STILLNESS_UNLOCK_AFTER_MOVEMENT_ONLY = true;

export const MISSION_DEFINITIONS = [
  {
    id: 1 as MissionId,
    title: 'Evidencia',
    description: 'Abre la camara y toma una foto para guardarla como evidencia.',
    points: MISSION_POINTS,
  },
  {
    id: 2 as MissionId,
    title: 'Movimiento real',
    description: `Alejate al menos ${MOVEMENT_TARGET_METERS} metros desde tu posicion inicial (GPS).`,
    points: MISSION_POINTS,
  },
  {
    id: 3 as MissionId,
    title: 'Permanencia activa',
    description:
      'Mantente quieto durante 10 segundos. Si hay movimiento brusco, el contador se reinicia.',
    points: MISSION_POINTS,
  },
];

export function defaultProgress(): MissionProgress[] {
  return [
    { id: 1, completed: false },
    { id: 2, completed: false },
    { id: 3, completed: false },
  ];
}

export function normalizeMissions(raw: unknown): MissionProgress[] {
  const base = defaultProgress();
  if (!Array.isArray(raw)) return base;
  return base.map((m) => {
    const found = raw.find((x: unknown) => {
      if (!x || typeof x !== 'object') return false;
      const o = x as { id?: number; completed?: boolean };
      return o.id === m.id;
    }) as { completed?: boolean } | undefined;
    return { id: m.id, completed: Boolean(found?.completed) };
  });
}

export function missionStatus(m: MissionProgress, all: MissionProgress[]): MissionStatus {
  if (m.completed) return 'completada';
  if (m.id === 1) return 'pendiente';
  if (m.id === 2) {
    const m1 = all.find((x) => x.id === 1);
    return m1?.completed ? 'pendiente' : 'bloqueada';
  }
  const m1 = all.find((x) => x.id === 1);
  const m2 = all.find((x) => x.id === 2);
  if (STILLNESS_UNLOCK_AFTER_MOVEMENT_ONLY) {
    return m2?.completed ? 'pendiente' : 'bloqueada';
  }
  return m1?.completed ? 'pendiente' : 'bloqueada';
}

export function missionBlockedHint(missionId: MissionId, all: MissionProgress[]): string | null {
  const m = all.find((x) => x.id === missionId);
  if (!m || m.completed) return null;
  const st = missionStatus(m, all);
  if (st !== 'bloqueada') return null;
  if (missionId === 2) return 'Completa primero la mision de evidencia (foto).';
  if (missionId === 3) {
    return STILLNESS_UNLOCK_AFTER_MOVEMENT_ONLY
      ? 'Completa primero la mision de movimiento (30 metros).'
      : 'Completa primero la mision de evidencia.';
  }
  return null;
}

export function completedCount(all: MissionProgress[]): number {
  return all.filter((m) => m.completed).length;
}

export function progressPercent(all: MissionProgress[]): number {
  return Math.round((completedCount(all) / 3) * 100);
}

export function totalPointsFromMissions(all: MissionProgress[]): number {
  return all.filter((m) => m.completed).length * MISSION_POINTS;
}
