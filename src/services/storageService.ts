import type { UserProgress } from '../types';
import { defaultProgress, normalizeMissions, totalPointsFromMissions } from '../utils/missions';

const key = (uid: string) => `missions_progress_${uid}`;

export function loadLocalProgress(uid: string): UserProgress | null {
  try {
    const raw = localStorage.getItem(key(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const missions = normalizeMissions(parsed.missions);
    const points =
      typeof parsed.points === 'number' ? parsed.points : totalPointsFromMissions(missions);
    return { points, missions };
  } catch {
    return null;
  }
}

export function saveLocalProgress(uid: string, data: UserProgress): void {
  const normalized: UserProgress = {
    points: data.points,
    missions: normalizeMissions(data.missions),
  };
  localStorage.setItem(key(uid), JSON.stringify(normalized));
}

export function clearLocalProgress(uid: string): void {
  localStorage.removeItem(key(uid));
}

export function emptyProgress(): UserProgress {
  const missions = defaultProgress();
  return { points: 0, missions };
}
