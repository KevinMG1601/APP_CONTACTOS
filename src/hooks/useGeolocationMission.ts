import { useCallback, useRef, useState } from 'react';
import {
  clearWatch,
  distanceFromStart,
  ensureGeoPermissions,
  getCurrentLatLng,
  watchPosition,
} from '../services/geoService';
import { Capacitor } from '@capacitor/core';
import { MOVEMENT_TARGET_METERS } from '../utils/missions';

export function useGeolocationMission() {
  const [active, setActive] = useState(false);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<string | null>(null);
  const startRef = useRef<{ lat: number; lng: number } | null>(null);
  const finishedRef = useRef(false);

  const stop = useCallback(async () => {
    if (watchId.current) {
      try {
        await clearWatch(watchId.current);
      } catch {
        /* noop */
      }
      watchId.current = null;
    }
    startRef.current = null;
    finishedRef.current = false;
    setActive(false);
  }, []);

  const start = useCallback(
    async (onComplete: (meters: number) => void) => {
      setError(null);
      try {
        await ensureGeoPermissions();
        const start = await getCurrentLatLng();
        startRef.current = start;
        finishedRef.current = false;
        setDistance(0);
        setActive(true);
        const id = await watchPosition(
          (lat, lng) => {
            const s = startRef.current;
            if (!s || finishedRef.current) return;
            const d = distanceFromStart(s.lat, s.lng, lat, lng);
            setDistance(d);
            if (d >= MOVEMENT_TARGET_METERS) {
              finishedRef.current = true;
              void stop().then(() => onComplete(d));
            }
          },
          (e) => setError(e.message || 'Error de ubicacion')
        );
        watchId.current = id;
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : Capacitor.getPlatform() === 'web'
              ? 'Error de ubicacion. Usa HTTPS y acepta los permisos.'
              : 'Error de ubicacion.';
        setError(msg);
        setActive(false);
      }
    },
    [stop]
  );

  return { active, distance, error, start, stop };
}
