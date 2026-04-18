import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MissionId, UserProgress } from '../types';
import { useAuth } from './AuthContext';
import { fetchUserProgress, persistEvidencePath, persistUserProgress } from '../services/firestoreUserService';
import { emptyProgress, loadLocalProgress, saveLocalProgress } from '../services/storageService';
import { notifyMission } from '../services/notificationsService';
import { defaultProgress, normalizeMissions, totalPointsFromMissions } from '../utils/missions';

function mergeProgress(remote: UserProgress | null, local: UserProgress | null): UserProgress {
  const base = defaultProgress();
  const missions = base.map((m) => {
    const r = remote?.missions.find((x) => x.id === m.id);
    const l = local?.missions.find((x) => x.id === m.id);
    return { id: m.id, completed: Boolean(r?.completed || l?.completed) };
  });
  const points = totalPointsFromMissions(missions);
  return { points, missions };
}

type MissionsCtx = {
  progress: UserProgress;
  loading: boolean;
  refresh: () => Promise<void>;
  completeMission: (id: MissionId, opts?: { evidencePath?: string }) => Promise<boolean>;
};

const Ctx = createContext<MissionsCtx | null>(null);

export const MissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, ready } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(emptyProgress());
  const [loading, setLoading] = useState(true);
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const refresh = useCallback(async () => {
    if (!user) {
      setProgress(emptyProgress());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let remote: UserProgress | null = null;
      try {
        remote = await fetchUserProgress(user.uid);
      } catch {
        remote = null;
      }
      const local = loadLocalProgress(user.uid);
      const merged = mergeProgress(remote, local);
      saveLocalProgress(user.uid, merged);
      try {
        await persistUserProgress(user.uid, merged, {
          displayName: user.displayName || 'usuario',
          email: user.email || '',
        });
      } catch {
        /* offline */
      }
      setProgress(merged);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    void refresh();
  }, [ready, user?.uid, refresh]);

  const completeMission = useCallback(
    async (id: MissionId, opts?: { evidencePath?: string }): Promise<boolean> => {
      if (!user) return false;
      const prev = progressRef.current;
      if (prev.missions.find((m) => m.id === id)?.completed) return false;
      const missions = prev.missions.map((m) => (m.id === id ? { ...m, completed: true } : m));
      const next: UserProgress = {
        points: totalPointsFromMissions(missions),
        missions,
      };
      progressRef.current = next;
      setProgress(next);
      saveLocalProgress(user.uid, next);
      try {
        await persistUserProgress(user.uid, next, {
          displayName: user.displayName || 'usuario',
          email: user.email || '',
        });
        if (opts?.evidencePath) {
          await persistEvidencePath(user.uid, opts.evidencePath);
        }
      } catch {
        /* offline */
      }
      const done = missions.filter((m) => m.completed).length;
      if (id === 1) {
        await notifyMission('Completaste una mision.');
      } else if (id === 2 && done === 2) {
        await notifyMission('Te falta una mision para terminar.');
      } else if (id === 3) {
        await notifyMission('Completaste una mision.');
      }
      return true;
    },
    [user]
  );

  const value = useMemo(
    () => ({
      progress,
      loading,
      refresh,
      completeMission,
    }),
    [progress, loading, refresh, completeMission]
  );

  useEffect(() => {
    if (!user && ready) {
      setProgress(emptyProgress());
    }
  }, [user, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useMissions(): MissionsCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMissions sin provider');
  return v;
}
