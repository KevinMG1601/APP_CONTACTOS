import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { UserProgress } from '../types';
import { getDb } from '../firebase/config';
import { normalizeMissions, totalPointsFromMissions } from '../utils/missions';

const userDoc = (uid: string) => doc(getDb(), 'users', uid);

export async function fetchUserProgress(uid: string): Promise<UserProgress | null> {
  const snap = await getDoc(userDoc(uid));
  if (!snap.exists()) return null;
  const d = snap.data() as {
    points?: number;
    missions?: unknown;
    displayName?: string;
    email?: string;
  };
  const missions = normalizeMissions(d.missions);
  const points = typeof d.points === 'number' ? d.points : totalPointsFromMissions(missions);
  return { points, missions };
}

export async function persistUserProgress(
  uid: string,
  data: UserProgress,
  meta: { displayName: string; email: string }
): Promise<void> {
  const missions = normalizeMissions(data.missions);
  const points = totalPointsFromMissions(missions);
  await setDoc(
    userDoc(uid),
    {
      uid,
      displayName: meta.displayName,
      email: meta.email,
      points,
      missions,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function persistEvidencePath(uid: string, path: string): Promise<void> {
  await setDoc(userDoc(uid), { evidencePhotoPath: path, updatedAt: serverTimestamp() }, { merge: true });
}
